var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Technician {
    constructor(name, averageRepairTime) {
        this._name = name;
        this._averageRepairTime = averageRepairTime;
        this._isBusy = false;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    get busy() {
        return this._isBusy;
    }
    set averageRepairTime(averageRepairTime) {
        this._averageRepairTime = averageRepairTime;
    }
    get averageRepairTime() {
        return this._averageRepairTime;
    }
    repairing(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            // add logic to simulate technician repairing process
            // you can use:
            // return new Promise<Customer>((resolve) => {
            //   setTimeout(() => {
            //     resolve(customer);
            //   }, this._averageRepairTime * 1000)
            // });
            // or your own logic
            return new Promise((resolve) => {
                this._isBusy = true;
                let timeout = setTimeout(() => {
                    customer.phoneSeries = this._name;
                    this._isBusy = false;
                    clearTimeout(timeout);
                    resolve(customer);
                }, this._averageRepairTime * 1000);
            });
        });
    }
}
class Customer {
    // you can add your own attribute
    constructor(name, phoneSeries) {
        this._name = name;
        this._phoneSeries = phoneSeries;
        this._phoneRepairedBy = null;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set phoneSeries(phoneSeries) {
        this._phoneSeries = phoneSeries;
    }
    get phoneSeries() {
        return this._phoneSeries;
    }
    get phoneRepairedBy() {
        return this._phoneRepairedBy;
    }
    set phoneRepairedBy(value) {
        this._phoneRepairedBy = value;
    }
}
class ServiceCenter {
    // you can add your own attribute
    constructor(name, address, technicians, customers) {
        this._name = name;
        this._address = address;
        this._technicians = technicians;
        this._customers = customers;
    }
    get name() {
        return this._name;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // add your logic on here
            // eg: process and print transition
            const customers = Array.from(this._customers);
            const recursive = (technician) => {
                const customer = customers.shift();
                if (!customer)
                    return;
                console.log(`>>> Technician ${technician.name} is repairing ${customer.name} phone. Customer phone is ${customer.phoneSeries} series`);
                technician.repairing(customer).then((result) => {
                    const index = this._customers.findIndex((c) => c.name === result.name);
                    this._customers[index].phoneRepairedBy = technician.name;
                    console.log(`    DONE: ${technician.name} finished repairing ${customer.name}`);
                    if (customers.length <= 0 && this._technicians.every((t) => !t.busy)) {
                        this._finished(this._customers);
                    }
                    else {
                        console.log(`\n### ${technician.name} is available to repair next customer... ###`);
                        recursive(technician);
                    }
                });
            };
            for (const technician of this._technicians) {
                recursive(technician);
            }
        });
    }
    // you can add your own method here
    finish(callback) {
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
const customers = new Array(10).fill(null).map((_, index) => {
    const customer = new Customer(`Customer ${index}`, series[Math.floor(Math.random() * 10)]);
    return customer;
});
// Define Service Center
const serviceCenter = new ServiceCenter('First Service Center', 'Long Ring Long Land Street', technicians, customers);
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
