class Technician {
  private _name: string;
  private _averageRepairTime: number; // 1 minute ~ 1 second
  private _isBusy: boolean;

  constructor(name: string, averageRepairTime: number) {
    this._name = name;
    this._averageRepairTime = averageRepairTime;
    this._isBusy = false;
  }

  public set name(name: string)  {
    this._name = name;
  }

  public get name() {
    return this._name;
  }

  public get busy() {
    return this._isBusy;
  }

  public set averageRepairTime(averageRepairTime: number) {
    this._averageRepairTime = averageRepairTime;
  }

  public get averageRepairTime() {
    return this._averageRepairTime;
  }

  public async repairing(customer: Customer) {
    // add logic to simulate technician repairing process

    // you can use:
    // return new Promise<Customer>((resolve) => {
    //   setTimeout(() => {
    //     resolve(customer);
    //   }, this._averageRepairTime * 1000)
    // });

    // or your own logic
    return new Promise<Customer>((resolve) => {
      this._isBusy = true;
      let timeout = setTimeout(() => {
        customer.phoneRepairedBy = this._name;
        this._isBusy = false;
        clearTimeout(timeout);
        resolve(customer);
      }, this._averageRepairTime * 1000)
    });
  }

  // you can add your own method here
  
}

class Customer {
  private _name: string;
  private _phoneSeries: string;
  private _phoneRepairedBy: string;
  // you can add your own attribute

  constructor(name: string, phoneSeries: string) {
    this._name = name;
    this._phoneSeries = phoneSeries;
    this._phoneRepairedBy = null;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get name(){
    return this._name;
  }

  public set phoneSeries(phoneSeries: string) {
    this._phoneSeries = phoneSeries;
  }

  public get phoneSeries(){
    return this._phoneSeries;
  }

  public get phoneRepairedBy() {
    return this._phoneRepairedBy;
  }

  public set phoneRepairedBy(value: string) {
    this._phoneRepairedBy = value;
  }
}

class ServiceCenter {
  private _name: string;
  private _address: string;
  private _technicians: Technician[];
  private _customers: Customer[];
  private _finished: (customers: Customer[]) => void;
  // you can add your own attribute

  constructor(name: string, address: string, technicians: Technician[], customers: Customer[]) {
    this._name = name;
    this._address = address;
    this._technicians = technicians;
    this._customers = customers;
  }

  public get name() {
    return this._name;
  }

  public async start(){
    // add your logic on here
    // eg: process and print transition

    const customers = Array.from(this._customers);
    const recursive = (technician: Technician) => {
      const customer = customers.shift();
      if (!customer) return;
      console.log(`>>> Technician ${technician.name} is repairing ${customer.name} phone. Customer phone is ${customer.phoneSeries} series`)
      technician.repairing(customer).then((result) => {
        console.log(`    DONE: ${technician.name} finished repairing ${customer.name}`);
        if (customers.length <= 0 && this._technicians.every((t) => !t.busy)) {
          this._finished(this._customers);
        } else {
          console.log(`\n### ${technician.name} is available to repair next customer... ###`);
          recursive(technician);
        }
      });
    }

    for (const technician of this._technicians) {
      recursive(technician);
    }
  }

  // you can add your own method here

  public finish(callback: (customers: Customer[]) => void) {
    this._finished = callback;
  }
}

// ====================================================================================
// MAIN
// ====================================================================================

// Define Technician
const dalton = new Technician('Dalton', 10); // 10 seconds
const wapol = new Technician('Wapol', 20); // 20 seconds
const technicians = [dalton, wapol];

// Define Customer
// Generate 10 customers
const series = ['Samsung', 'Xiaomi', 'iPhone', 'Oppo', 'Vivo', 'Realme', 'Nokia', 'Sony', 'LG', 'Asus'];
const customers = new Array(10).fill(null).map((_ ,index) => {
  const customer = new Customer(`Customer ${index}`, series[Math.floor(Math.random() * 10)]);
  return customer;
});

// Define Service Center
const serviceCenter: ServiceCenter = new ServiceCenter('First Service Center', 'Long Ring Long Land Street', technicians, customers);
console.log('Customer on queue: ');
console.table(customers);
console.log('\n');

const _start = Date.now();

// Begin Operating
console.log(`${serviceCenter.name} start operating today: `);
serviceCenter.start().catch(err => console.log(err));
serviceCenter.finish((customers) => {
  console.log('Customer after repaired: ');
  console.table(customers);
  console.log(`Total time: ${(Date.now() - _start) / 1000}s`);
});
