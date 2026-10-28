# The JavaScript Master Handbook of Low-Level Design (LLD) & Object-Oriented Design (OOD)

> A complete, beginner-to-advanced curriculum written entirely in **Modern JavaScript (ES6+ / Node.js)**. Every single concept, principle, and pattern includes **at least two distinct, real-world scenario examples** to give you practical intuition and code muscle memory.

---

## Curriculum Table of Contents
1. [Level 0: The Absolute Foundations (JavaScript Context)](#level-0-the-absolute-foundations-javascript-context)
2. [Level 1: OOP Building Blocks in JavaScript](#level-1-oop-building-blocks-in-javascript)
3. [Level 2: The 4 Pillars of OOP (with 2 Scenarios Each)](#level-2-the-4-pillars-of-oop)
4. [Level 3: Class Relationships & Modeling in JavaScript](#level-3-class-relationships--modeling-in-javascript)
5. [Level 4: Core Principles (DRY, KISS, YAGNI, SOLID with 2 Scenarios Each)](#level-4-core-principles-dry-kiss-yagni-solid)
6. [Level 5: The 23 GoF Design Patterns (All with 2 Distinct Scenarios)](#level-5-the-23-gof-design-patterns)
   - [Creational Patterns (5)](#a-creational-patterns)
   - [Structural Patterns (7)](#b-structural-patterns)
   - [Behavioral Patterns (11)](#c-behavioral-patterns)
7. [Level 6: Concurrency & Race Conditions in Node.js](#level-6-concurrency--race-conditions-in-nodejs)
8. [Level 7: The LLD Interview Blueprint](#level-7-the-lld-interview-blueprint)

---

# Level 0: The Absolute Foundations (JavaScript Context)

### 1. Why Do We Need Low-Level Design in JavaScript?
JavaScript started as a simple browser scripting tool. Today, entire enterprise systems, cloud microservices, and mobile applications (via Node.js, Express, React, React Native) are built with JavaScript.

Without Low-Level Design:
* Code becomes massive procedural files with nested callback hell or tangled `async/await` blocks.
* Functions take 10 parameters where half are `undefined`.
* Small bug fixes in payment logic break user profile pages.

**LLD is the art of organizing code into clean, single-purpose classes and modules that can grow to 100,000+ lines without collapsing.**

---

### 2. Procedural vs. Object-Oriented in JavaScript

#### Scenario 1: Managing User Orders (E-Commerce)
```javascript
// ❌ PROCEDURAL: Loose state and external functions
let userBalance = 100;
let userCart = [{ item: "Shoes", price: 80 }];

function checkout(balance, cart) {
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    if (balance >= total) {
        return balance - total;
    }
    throw new Error("Insufficient funds");
}
userBalance = checkout(userBalance, userCart);
// Problem: Anyone can directly mutate userBalance = -9999 anywhere in the codebase!

// ✅ OBJECT-ORIENTED: Encapsulated State and Behavior
class Wallet {
    #balance; // Private field (ES2022)

    constructor(initialBalance = 0) {
        this.#balance = Math.max(0, initialBalance);
    }

    deduct(amount) {
        if (amount <= 0) throw new Error("Amount must be positive");
        if (amount > this.#balance) throw new Error("Insufficient balance");
        this.#balance -= amount;
        return this.#balance;
    }

    getBalance() {
        return this.#balance;
    }
}
```

#### Scenario 2: Game Character Stats (RPG Game)
```javascript
// ❌ PROCEDURAL: Global attributes scattered
let playerX = 10;
let playerY = 20;
let playerHealth = 100;

function takeDamage(damage) {
    playerHealth -= damage;
}

// ✅ OBJECT-ORIENTED: Self-contained entity
class GameCharacter {
    #health = 100;
    #x = 0;
    #y = 0;

    constructor(name) {
        this.name = name;
    }

    move(dx, dy) {
        this.#x += dx;
        this.#y += dy;
    }

    receiveDamage(hitPoints) {
        this.#health = Math.max(0, this.#health - hitPoints);
        if (this.#health === 0) {
            console.log(`${this.name} has fallen in battle!`);
        }
    }

    isAlive() {
        return this.#health > 0;
    }
}
```

---

# Level 1: OOP Building Blocks in JavaScript

### 1. Classes, Constructors, and Private Fields (`#`)
JavaScript uses prototypal inheritance under the hood, but ES6 `class` syntax provides clean object-oriented semantics.

```javascript
class BankAccount {
    // Private fields: accessible ONLY inside this class
    #accountNumber;
    #balance;

    constructor(accountNumber, initialDeposit = 0) {
        this.#accountNumber = accountNumber;
        this.#balance = initialDeposit;
    }

    deposit(amount) {
        if (amount <= 0) throw new Error("Must deposit positive amount");
        this.#balance += amount;
    }

    getBalance() {
        return this.#balance;
    }
}
```

---

### 2. Enums in JavaScript
JavaScript doesn't have a native `enum` keyword, but we create **immutable type-safe enums** using `Object.freeze()`:

```javascript
// Scenario 1: Order Statuses
const OrderStatus = Object.freeze({
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
});

// Scenario 2: Vehicle Types for Parking Lot
const VehicleType = Object.freeze({
    MOTORCYCLE: { size: 1, label: "Two Wheeler" },
    CAR: { size: 2, label: "Four Wheeler Passenger" },
    TRUCK: { size: 3, label: "Heavy Commercial" }
});
```

---

### 3. Interfaces and Abstract Classes in JavaScript
JavaScript doesn't have an `interface` or `abstract` keyword like Java or TypeScript. In professional JavaScript LLD, we simulate interfaces and abstract classes by **throwing errors if methods are not implemented**.

```javascript
// Abstract Class / Interface Simulation
class PaymentProcessor {
    constructor() {
        if (this.constructor === PaymentProcessor) {
            throw new Error("Cannot instantiate abstract class PaymentProcessor directly!");
        }
    }

    processPayment(amount) {
        throw new Error("Method 'processPayment(amount)' must be implemented!");
    }
}

// Concrete Implementation
class StripeProcessor extends PaymentProcessor {
    processPayment(amount) {
        console.log(`Processing $${amount} via Stripe API.`);
    }
}
```

---

# Level 2: The 4 Pillars of OOP

---

### Pillar 1: Encapsulation

> **Definition:** Bundling data and methods that act on that data inside a class, while restricting direct access to internal state using private fields (`#`).

#### Scenario 1: Digital Wallet / FinTech App
```javascript
class DigitalWallet {
    #balance = 0;
    #dailyWithdrawalLimit = 1000;
    #withdrawnToday = 0;

    constructor(ownerName, startingCash) {
        this.ownerName = ownerName;
        this.#balance = startingCash;
    }

    withdraw(amount) {
        if (amount <= 0) throw new Error("Invalid withdrawal amount.");
        if (amount > this.#balance) throw new Error("Insufficient balance.");
        if (this.#withdrawnToday + amount > this.#dailyWithdrawalLimit) {
            throw new Error("Daily withdrawal limit exceeded.");
        }

        this.#balance -= amount;
        this.#withdrawnToday += amount;
        return this.#balance;
    }

    getBalance() {
        return this.#balance; // Read-only access
    }
}
```

#### Scenario 2: Smart Thermostat (IoT Home System)
```javascript
class SmartThermostat {
    #temperatureCelsius = 21; // Default room temp

    setTemperature(celsius) {
        // Enforce physical boundary safety rules
        if (celsius < 10 || celsius > 35) {
            throw new Error("Temperature out of safe residential range (10°C - 35°C).");
        }
        this.#temperatureCelsius = celsius;
        console.log(`Thermostat set to ${this.#temperatureCelsius}°C`);
    }

    getTemperatureFahrenheit() {
        return (this.#temperatureCelsius * 9) / 5 + 32;
    }
}
```

---

### Pillar 2: Abstraction

> **Definition:** Hiding underlying complexity and providing a simple, high-level interface.

#### Scenario 1: Cloud Storage File Upload (AWS S3 vs. Local Disk)
The caller doesn't need to know about multipart upload chunks, socket retries, or S3 bucket policies. They just call `upload()`.

```javascript
class FileStorageService {
    upload(fileName, buffer) {
        throw new Error("upload() must be implemented");
    }
}

class S3StorageService extends FileStorageService {
    #s3Client;

    constructor(bucketName, credentials) {
        super();
        this.bucketName = bucketName;
        this.#s3Client = this.#initializeAWS(credentials);
    }

    #initializeAWS(creds) {
        return { connected: true }; // Simulating complex connection
    }

    upload(fileName, buffer) {
        console.log(`Encrypting buffer and streaming ${fileName} to AWS S3 bucket: ${this.bucketName}`);
    }
}

// Client uses clean abstraction:
const storage = new S3StorageService("my-production-assets", { key: "secret" });
storage.upload("avatar.png", Buffer.from("data"));
```

#### Scenario 2: Car Engine Ignition
```javascript
class Car {
    #fuelInjector = { inject: () => console.log("Injecting atomized fuel...") };
    #sparkPlug = { fire: () => console.log("Spark plug firing combustion...") };
    #starterMotor = { crank: () => console.log("Starter motor cranking flywheel...") };

    // Beautiful, clean abstraction
    startCar() {
        this.#starterMotor.crank();
        this.#fuelInjector.inject();
        this.#sparkPlug.fire();
        console.log("Engine running smoothly. Ready to drive!");
    }
}

const myCar = new Car();
myCar.startCar(); // One clean call
```

---

### Pillar 3: Inheritance

> **Definition:** Creating specialized classes that inherit properties and behaviors from a general base class.

#### Scenario 1: Employee Payroll System
```javascript
class Employee {
    constructor(id, name, baseSalary) {
        this.id = id;
        this.name = name;
        this.baseSalary = baseSalary;
    }

    calculateMonthlyPay() {
        return this.baseSalary / 12;
    }
}

class CommissionSalesPerson extends Employee {
    constructor(id, name, baseSalary, commissionRate) {
        super(id, name, baseSalary);
        this.commissionRate = commissionRate;
        this.salesThisMonth = 0;
    }

    recordSale(amount) {
        this.salesThisMonth += amount;
    }

    calculateMonthlyPay() {
        const basePay = super.calculateMonthlyPay();
        const commission = this.salesThisMonth * this.commissionRate;
        this.salesThisMonth = 0; // Reset for next month
        return basePay + commission;
    }
}
```

#### Scenario 2: UI Form Controls
```javascript
class UIComponent {
    constructor(id) {
        this.id = id;
        this.isVisible = true;
    }

    show() { this.isVisible = true; }
    hide() { this.isVisible = false; }
}

class ButtonComponent extends UIComponent {
    constructor(id, label, onClickCallback) {
        super(id);
        this.label = label;
        this.onClick = onClickCallback;
    }

    click() {
        if (!this.isVisible) return;
        console.log(`Button [${this.label}] clicked!`);
        this.onClick();
    }
}
```

---

### Pillar 4: Polymorphism

> **Definition:** The ability for different objects to respond to the same method invocation in their own unique way.

#### Scenario 1: Notification Dispatcher
```javascript
class NotificationChannel {
    send(recipient, message) {
        throw new Error("Must implement send()");
    }
}

class EmailChannel extends NotificationChannel {
    send(recipient, message) {
        console.log(`Sending Email to ${recipient}: "${message}"`);
    }
}

class WhatsAppChannel extends NotificationChannel {
    send(recipient, message) {
        console.log(`Sending WhatsApp message to +${recipient}: "${message}"`);
    }
}

class InAppPushChannel extends NotificationChannel {
    send(recipient, message) {
        console.log(`Pushing Notification to Device UUID ${recipient}: "${message}"`);
    }
}

// Polymorphic Dispatch: Client doesn't care which channel it is
function broadcastAlert(channels, user, alertText) {
    for (const channel of channels) {
        channel.send(user, alertText);
    }
}
```

#### Scenario 2: Shape Area Calculator (Graphics Engine)
```javascript
class Shape {
    calculateArea() { throw new Error("calculateArea() required"); }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    calculateArea() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    calculateArea() { return this.width * this.height; }
}

function printTotalCanvasArea(shapes) {
    const total = shapes.reduce((sum, s) => sum + s.calculateArea(), 0);
    console.log(`Total Canvas Area: ${total.toFixed(2)} sq units.`);
}
```

---

# Level 3: Class Relationships & Modeling in JavaScript

When drawing UML diagrams and designing systems, objects relate in 4 primary ways:

```
RELATIONSHIPS
├── Dependency    -> Method receives another object as an argument temporarily.
├── Association   -> Two classes maintain references to each other (independent lifecycles).
├── Aggregation   -> Weak "has-a". Child exists even if parent is deleted.
└── Composition   -> Strong "has-a". Parent strictly owns child's lifecycle.
```

---

### Scenario 1: Hospital Management (Aggregation vs. Composition)

```javascript
// AGGREGATION: Doctor and Hospital
// A Doctor works at a Hospital. If the Hospital shuts down, the Doctor still exists!
class Doctor {
    constructor(name, specialty) {
        this.name = name;
        this.specialty = specialty;
    }
}

class Hospital {
    constructor(name) {
        this.name = name;
        this.doctors = []; // Aggregation (stored reference)
    }

    hireDoctor(doctor) {
        this.doctors.push(doctor);
    }
}

// COMPOSITION: Patient and MedicalRecord
// A MedicalRecord belongs exclusively to one Patient. Destroy the patient file, the record is gone.
class MedicalRecord {
    constructor(bloodType, allergies) {
        this.bloodType = bloodType;
        this.allergies = allergies;
    }
}

class Patient {
    constructor(name, bloodType, allergies) {
        this.name = name;
        // Composition: Child instantiated and owned internally
        this.record = new MedicalRecord(bloodType, allergies);
    }
}
```

---

### Scenario 2: E-Commerce Orders (Association & Dependency)

```javascript
// ASSOCIATION: Customer and CreditCard
class CreditCard {
    constructor(number, expiry) {
        this.number = number;
        this.expiry = expiry;
    }
}

class Customer {
    constructor(name) {
        this.name = name;
        this.savedCard = null; // Associated with a card
    }

    addPaymentCard(card) {
        this.savedCard = card;
    }
}

// DEPENDENCY: Order and ReceiptPrinter
// Order only uses ReceiptPrinter for 2 seconds inside generateReceipt().
class ReceiptPrinter {
    printText(text) { console.log(`[PRINTER OUTPUT]:\n${text}`); }
}

class Order {
    constructor(id, total) {
        this.id = id;
        this.total = total;
    }

    // Dependency: ReceiptPrinter passed as temporary argument
    generateReceipt(printer) {
        const receipt = `Order #${this.id} | Total: $${this.total}`;
        printer.printText(receipt);
    }
}
```

---

# Level 4: Core Principles (DRY, KISS, YAGNI, SOLID)

---

### 1. S - Single Responsibility Principle (SRP)
> *"A class should have one, and only one, reason to change."*

#### Scenario 1: User Registration
```javascript
// ❌ VIOLATION: One class does validation, DB save, and sending email
class UserRegistrationServiceBroken {
    register(userData) {
        // Reason to change 1: Validation rules change
        if (!userData.email.includes("@")) throw new Error("Invalid email");
        // Reason to change 2: Database engine changes from MySQL to Mongo
        console.log("Saving user to database...");
        // Reason to change 3: Switching email provider from SendGrid to Postmark
        console.log("Sending welcome email via SMTP...");
    }
}

// ✅ REFACTORED (SRP):
class UserValidator {
    validate(userData) {
        if (!userData.email || !userData.email.includes("@")) {
            throw new Error("Invalid email format");
        }
    }
}

class UserRepository {
    save(userData) {
        console.log(`Persisting user ${userData.email} to PostgreSQL`);
    }
}

class WelcomeEmailNotifier {
    send(email) {
        console.log(`Sending welcome email to ${email}`);
    }
}

class UserRegistrationService {
    constructor(validator, repo, notifier) {
        this.validator = validator;
        this.repo = repo;
        this.notifier = notifier;
    }

    register(userData) {
        this.validator.validate(userData);
        this.repo.save(userData);
        this.notifier.send(userData.email);
    }
}
```

#### Scenario 2: Shopping Cart & Invoice Printing
```javascript
// Cart manages items. It shouldn't know how to format a PDF!
class ShoppingCart {
    #items = [];

    addItem(name, price) { this.#items.push({ name, price }); }
    getItems() { return [...this.#items]; }
    calculateTotal() { return this.#items.reduce((sum, i) => sum + i.price, 0); }
}

class InvoicePrinter {
    printThermalReceipt(cart) {
        console.log("=== THERMAL STORE RECEIPT ===");
        cart.getItems().forEach(i => console.log(`${i.name}: $${i.price}`));
        console.log(`TOTAL: $${cart.calculateTotal()}`);
    }

    generatePDF(cart) {
        console.log(`Generating PDF vector invoice for $${cart.calculateTotal()}`);
    }
}
```

---

### 2. O - Open/Closed Principle (OCP)
> *"Open for extension, closed for modification."*

#### Scenario 1: Payment Gateways
```javascript
// ❌ VIOLATION: Adding ApplePay requires modifying existing if-else branches!
class PaymentManagerBroken {
    pay(amount, method) {
        if (method === "CREDIT_CARD") { /* process card */ }
        else if (method === "PAYPAL") { /* process paypal */ }
        else if (method === "CRYPTO") { /* process crypto */ }
    }
}

// ✅ REFACTORED (OCP): Interface strategy
class PaymentStrategy {
    pay(amount) { throw new Error("pay() must be implemented"); }
}

class CreditCardPayment extends PaymentStrategy {
    pay(amount) { console.log(`Paid $${amount} with Credit Card.`); }
}

class ApplePayPayment extends PaymentStrategy {
    pay(amount) { console.log(`Paid $${amount} with Apple Pay biometric token.`); }
}

// New methods can be added anytime without touching PaymentManager!
class PaymentManager {
    process(strategy, amount) {
        strategy.pay(amount);
    }
}
```

#### Scenario 2: Video Game Weapon Damage Modifiers
```javascript
class AttackModifier {
    modifyDamage(baseDamage) { return baseDamage; }
}

class FireEnchantment extends AttackModifier {
    modifyDamage(baseDamage) { return baseDamage + 15; }
}

class CriticalStrike extends AttackModifier {
    modifyDamage(baseDamage) { return baseDamage * 2; }
}

class Weapon {
    constructor(baseDamage, modifiers = []) {
        this.baseDamage = baseDamage;
        this.modifiers = modifiers;
    }

    strike() {
        let totalDamage = this.baseDamage;
        for (const mod of this.modifiers) {
            totalDamage = mod.modifyDamage(totalDamage);
        }
        return totalDamage;
    }
}
```

---

### 3. L - Liskov Substitution Principle (LSP)
> *"Subtypes must be substitutable for their base types without breaking client expectations."*

#### Scenario 1: Read-Only vs. Writable File System
```javascript
// ❌ VIOLATION: ReadOnlyFile throws on write(), breaking caller expectations!
class File {
    read() { return "content"; }
    write(data) { console.log("writing data"); }
}

class ReadOnlyFileBroken extends File {
    write(data) {
        throw new Error("Cannot write to read-only file!"); // Breaks LSP!
    }
}

// ✅ REFACTORED:
class ReadableFile {
    read() { return "content"; }
}

class WritableFile extends ReadableFile {
    write(data) { console.log(`Writing: ${data}`); }
}
```

#### Scenario 2: Bank Accounts with Withdrawal Restrictions
```javascript
// Fixed deposit accounts cannot be withdrawn before maturity!
class Account {
    constructor(balance) { this.balance = balance; }
}

class DepositOnlyAccount extends Account {
    deposit(amount) { this.balance += amount; }
}

class CheckingAccount extends DepositOnlyAccount {
    withdraw(amount) {
        if (amount > this.balance) throw new Error("No funds");
        this.balance -= amount;
    }
}
```

---

### 4. I - Interface Segregation Principle (ISP)
> *"Clients should not be forced to depend on methods they don't use."*

#### Scenario 1: Smart Home Device Controls
```javascript
// ❌ VIOLATION: Fat interface forces a light bulb to implement audio controls
class SmartDeviceFatInterface {
    turnOn() {}
    turnOff() {}
    setVolume(vol) {} // Light bulbs don't have speakers!
}

// ✅ REFACTORED: Segmented roles
const Switchable = (Base) => class extends Base {
    turnOn() { console.log("Power ON"); }
    turnOff() { console.log("Power OFF"); }
};

const Dimmable = (Base) => class extends Base {
    setBrightness(lvl) { console.log(`Brightness: ${lvl}%`); }
};

const VolumeControllable = (Base) => class extends Base {
    setVolume(vol) { console.log(`Volume: ${vol}`); }
};

// Smart Light Bulb gets only what it supports
class SmartLight extends Dimmable(Switchable(Object)) {}

// Smart Speaker gets switch and volume
class SmartSpeaker extends VolumeControllable(Switchable(Object)) {}
```

#### Scenario 2: Video Player Controls
```javascript
// Some audio files don't support subtitles or video resolution changes!
class AudioPlayer {
    play() {}
    pause() {}
    setVolume(lvl) {}
}

class VideoPlayer extends AudioPlayer {
    setSubtitles(lang) {}
    setResolution(p) {}
}
```

---

### 5. D - Dependency Inversion Principle (DIP)
> *"Depend upon abstractions, not concrete implementations."*

#### Scenario 1: Sending Notifications
```javascript
// ❌ VIOLATION: High-level AlertService directly imports concrete TwilioService
class TwilioService {
    sendSMS(phone, msg) { console.log(`Twilio SMS to ${phone}: ${msg}`); }
}

class AlertServiceBroken {
    constructor() {
        this.sender = new TwilioService(); // TIGHT COUPLING! Cannot mock in tests!
    }
}

// ✅ REFACTORED (DIP): Invert the control via constructor injection
class AlertService {
    constructor(messageService) {
        this.messageService = messageService; // Depends on abstraction
    }

    triggerSecurityAlert(contact, text) {
        this.messageService.sendMessage(contact, text);
    }
}
```

#### Scenario 2: Authentication Service & User Store
```javascript
class AuthService {
    constructor(userStore) {
        // userStore is an abstraction: could be Mongo, Redis, or an in-memory mock
        this.userStore = userStore;
    }

    async login(email, password) {
        const user = await this.userStore.findByEmail(email);
        if (!user || user.password !== password) {
            throw new Error("Invalid credentials");
        }
        return user;
    }
}
```

---

# Level 5: The 23 GoF Design Patterns

---

## A. Creational Patterns

---

### 1. Singleton Pattern
* **Intent:** Ensure a class has only one instance, providing a global access point.

#### Scenario 1: Database Connection Pool
```javascript
class DatabaseConnectionPool {
    static #instance = null;

    constructor() {
        if (DatabaseConnectionPool.#instance) {
            return DatabaseConnectionPool.#instance;
        }
        this.poolId = Math.floor(Math.random() * 100000);
        console.log(`Connecting to DB. Created Pool ID: ${this.poolId}`);
        DatabaseConnectionPool.#instance = this;
    }

    query(sql) {
        console.log(`[Pool ${this.poolId}] Executing: ${sql}`);
    }
}

const pool1 = new DatabaseConnectionPool();
const pool2 = new DatabaseConnectionPool();
console.log(pool1 === pool2); // true (Identical instance!)
```

#### Scenario 2: App Configuration Store
```javascript
class AppConfig {
    static #instance = null;
    #settings = new Map();

    constructor() {
        if (AppConfig.#instance) return AppConfig.#instance;
        this.#settings.set("ENV", "production");
        this.#settings.set("PORT", 8080);
        AppConfig.#instance = this;
    }

    get(key) { return this.#settings.get(key); }
    set(key, val) { this.#settings.set(key, val); }
}
```

---

### 2. Factory Method Pattern
* **Intent:** Define an interface for creating objects, letting subclasses decide which class to instantiate.

#### Scenario 1: Logistics Transport (Road vs. Sea)
```javascript
class Vehicle {
    deliver() { throw new Error("deliver() required"); }
}
class DeliveryTruck extends Vehicle {
    deliver() { console.log("Delivering package overland in a cargo truck."); }
}
class CargoShip extends Vehicle {
    deliver() { console.log("Delivering containers overseas via cargo ship."); }
}

class LogisticsManager {
    createTransport() { throw new Error("Factory method must be overridden"); }

    dispatchDelivery() {
        const vehicle = this.createTransport();
        vehicle.deliver();
    }
}

class RoadLogistics extends LogisticsManager {
    createTransport() { return new DeliveryTruck(); }
}
class SeaLogistics extends LogisticsManager {
    createTransport() { return new CargoShip(); }
}
```

#### Scenario 2: Dialog Box UI Creator (Windows vs. Mac)
```javascript
class WindowsDialog { render() { console.log("Rendering Windows metro dialog"); } }
class MacDialog { render() { console.log("Rendering macOS rounded dialog"); } }

function createDialog(osType) {
    if (osType === "WIN") return new WindowsDialog();
    if (osType === "MAC") return new MacDialog();
    throw new Error("Unsupported OS");
}
```

---

### 3. Abstract Factory Pattern
* **Intent:** Create families of related or dependent objects without specifying their concrete classes.

#### Scenario 1: Victorian vs. Modern Furniture
```javascript
// Abstract Products: Chair, Sofa
class ModernChair { sitOn() { console.log("Sitting on a sleek modern chair."); } }
class ModernSofa { lounge() { console.log("Lounging on minimalist leather sofa."); } }

class VictorianChair { sitOn() { console.log("Sitting on an ornate velvet Victorian chair."); } }
class VictorianSofa { lounge() { console.log("Lounging on an antique curved Victorian sofa."); } }

// Abstract Factory
class FurnitureFactory {
    createChair() {}
    createSofa() {}
}

class ModernFurnitureFactory extends FurnitureFactory {
    createChair() { return new ModernChair(); }
    createSofa() { return new ModernSofa(); }
}

class VictorianFurnitureFactory extends FurnitureFactory {
    createChair() { return new VictorianChair(); }
    createSofa() { return new VictorianSofa(); }
}
```

#### Scenario 2: Light Theme vs. Dark Theme UI Kits
```javascript
class DarkButton { draw() { console.log("Dark button (#1e1e1e)"); } }
class DarkScrollbar { draw() { console.log("Dark scrollbar (#333333)"); } }

class LightButton { draw() { console.log("Light button (#f0f0f0)"); } }
class LightScrollbar { draw() { console.log("Light scrollbar (#cccccc)"); } }

class DarkThemeFactory {
    createButton() { return new DarkButton(); }
    createScrollbar() { return new DarkScrollbar(); }
}
```

---

### 4. Builder Pattern
* **Intent:** Separate the construction of a complex object from its representation, supporting step-by-step method chaining.

#### Scenario 1: Custom Computer Assembly
```javascript
class CustomPC {
    constructor() {
        this.cpu = null;
        this.ram = null;
        this.gpu = null;
        this.hasLiquidCooling = false;
    }
}

class PCBuilder {
    constructor() { this.pc = new CustomPC(); }

    setCPU(cpu) { this.pc.cpu = cpu; return this; }
    setRAM(ram) { this.pc.ram = ram; return this; }
    setGPU(gpu) { this.pc.gpu = gpu; return this; }
    enableLiquidCooling() { this.pc.hasLiquidCooling = true; return this; }

    build() {
        if (!this.pc.cpu || !this.pc.ram) throw new Error("CPU and RAM are mandatory!");
        return this.pc;
    }
}

const myGamingPC = new PCBuilder()
    .setCPU("Ryzen 9 7950X")
    .setRAM("64GB DDR5")
    .setGPU("RTX 4090")
    .enableLiquidCooling()
    .build();
```

#### Scenario 2: SQL Query Builder
```javascript
class SQLQueryBuilder {
    constructor(table) {
        this.table = table;
        this.fields = "*";
        this.whereClause = "";
        this.limitCount = null;
    }

    select(fields) { this.fields = fields.join(", "); return this; }
    where(condition) { this.whereClause = `WHERE ${condition}`; return this; }
    limit(n) { this.limitCount = `LIMIT ${n}`; return this; }

    toSQL() {
        return `SELECT ${this.fields} FROM ${this.table} ${this.whereClause} ${this.limitCount || ""}`.trim();
    }
}

const sql = new SQLQueryBuilder("users")
    .select(["id", "name", "email"])
    .where("active = 1")
    .limit(10)
    .toSQL();
```

---

### 5. Prototype Pattern
* **Intent:** Clone existing objects without coupling code to their concrete classes.

#### Scenario 1: Video Game NPC Enemy Spawner
```javascript
class MonsterPrototype {
    constructor(type, health, attackPower, abilities) {
        this.type = type;
        this.health = health;
        this.attackPower = attackPower;
        this.abilities = abilities;
    }

    clone() {
        // Deep clone abilities array
        return new MonsterPrototype(
            this.type,
            this.health,
            this.attackPower,
            [...this.abilities]
        );
    }
}

const goblinMaster = new MonsterPrototype("Goblin Scout", 50, 10, ["Stealth", "Bite"]);
const goblin1 = goblinMaster.clone();
const goblin2 = goblinMaster.clone();
```

#### Scenario 2: Document Template Duplication (Invoices)
```javascript
class InvoiceTemplate {
    constructor(companyHeader, taxRate, currency) {
        this.companyHeader = companyHeader;
        this.taxRate = taxRate;
        this.currency = currency;
    }

    clone() {
        return new InvoiceTemplate(this.companyHeader, this.taxRate, this.currency);
    }
}
```

---

## B. Structural Patterns

---

### 6. Adapter Pattern
* **Intent:** Convert the interface of a class into another interface clients expect.

#### Scenario 1: XML to JSON Analytics Adapter
```javascript
// Third-party analytics engine expects JSON: { event: string, userId: number }
class ModernAnalyticsEngine {
    sendEvent(jsonPayload) {
        console.log(`Pushed to Datadog: ${JSON.stringify(jsonPayload)}`);
    }
}

// Our Legacy System emits XML strings
class LegacyXMLEmitter {
    generateXML() {
        return `<data><event>LOGIN</event><userId>402</userId></data>`;
    }
}

// Adapter converts XML to JSON
class XMLToAnalyticsAdapter {
    constructor(analyticsEngine) {
        this.analyticsEngine = analyticsEngine;
    }

    pushLegacyEvent(xmlString) {
        // Parse XML (simulated regex parsing)
        const eventMatch = xmlString.match(/<event>(.*?)<\/event>/)[1];
        const userMatch = Number(xmlString.match(/<userId>(.*?)<\/userId>/)[1]);

        this.analyticsEngine.sendEvent({ event: eventMatch, userId: userMatch });
    }
}
```

#### Scenario 2: Third-Party SMS SDK Adapter
```javascript
class TwilioSDK {
    sendRawMessage(phoneStr, bodyText) { console.log(`Twilio SMS sent to ${phoneStr}`); }
}

class NotificationAdapter {
    constructor(twilio) { this.twilio = twilio; }

    notify(user, message) {
        this.twilio.sendRawMessage(user.phoneNumber, message);
    }
}
```

---

### 7. Bridge Pattern
* **Intent:** Decouple an abstraction from its implementation so that both can vary independently.

#### Scenario 1: Universal Remote Controls and TVs
```javascript
// Implementation Layer
class Device {
    turnOn() {}
    turnOff() {}
}
class SonyTV extends Device {
    turnOn() { console.log("Sony TV power ON."); }
}
class LGTV extends Device {
    turnOn() { console.log("LG WebOS power ON."); }
}

// Abstraction Layer
class RemoteControl {
    constructor(device) { this.device = device; }
    pressPower() { this.device.turnOn(); }
}

class AdvancedMuteRemote extends RemoteControl {
    pressMute() { console.log("Command: Muting device."); }
}
```

#### Scenario 2: Multi-Platform Render Engine (DirectX vs. OpenGL)
```javascript
class DirectXAPI { drawPixels(x, y) { console.log("DirectX rendering pixels"); } }
class OpenGLAPI { drawPixels(x, y) { console.log("OpenGL rendering pixels"); } }

class ShapeRenderer {
    constructor(graphicsAPI) { this.api = graphicsAPI; }
    renderCircle() { this.api.drawPixels(10, 10); }
}
```

---

### 8. Composite Pattern
* **Intent:** Compose objects into tree structures to represent part-whole hierarchies. Treat individual objects and compositions uniformly.

#### Scenario 1: File and Folder System
```javascript
class FileSystemNode {
    getSize() { throw new Error("getSize() must be implemented"); }
}

class FileNode extends FileSystemNode {
    constructor(name, sizeInKB) {
        super();
        this.name = name;
        this.sizeInKB = sizeInKB;
    }
    getSize() { return this.sizeInKB; }
}

class FolderNode extends FileSystemNode {
    constructor(name) {
        super();
        this.name = name;
        this.children = [];
    }

    add(node) { this.children.push(node); }

    getSize() {
        return this.children.reduce((total, child) => total + child.getSize(), 0);
    }
}

// Tree construction:
const root = new FolderNode("root");
const docs = new FolderNode("docs");
docs.add(new FileNode("resume.pdf", 250));
docs.add(new FileNode("photo.jpg", 1200));
root.add(docs);
root.add(new FileNode("hosts.txt", 4));

console.log(`Total Directory Size: ${root.getSize()} KB`); // 1454 KB
```

#### Scenario 2: DOM UI Elements
```javascript
class DOMElement {
    render() { throw new Error("render() required"); }
}
class TextNode extends DOMElement {
    constructor(text) { super(); this.text = text; }
    render() { return this.text; }
}
class DivElement extends DOMElement {
    constructor() { super(); this.children = []; }
    append(child) { this.children.push(child); }
    render() {
        return `<div>${this.children.map(c => c.render()).join("")}</div>`;
    }
}
```

---

### 9. Decorator Pattern
* **Intent:** Attach additional responsibilities to an object dynamically without modifying the underlying class.

#### Scenario 1: Coffee Ordering System
```javascript
class Coffee {
    cost() { return 3.0; }
    description() { return "Basic Espresso"; }
}

class MilkDecorator {
    constructor(coffee) { this.coffee = coffee; }
    cost() { return this.coffee.cost() + 0.50; }
    description() { return `${this.coffee.description()} + Steamed Milk`; }
}

class VanillaSyrupDecorator {
    constructor(coffee) { this.coffee = coffee; }
    cost() { return this.coffee.cost() + 0.75; }
    description() { return `${this.coffee.description()} + Vanilla Syrup`; }
}

let myDrink = new Coffee();
myDrink = new MilkDecorator(myDrink);
myDrink = new VanillaSyrupDecorator(myDrink);
console.log(`${myDrink.description()} = $${myDrink.cost()}`); // $4.25
```

#### Scenario 2: Web Server Request Handlers (Logging & Auth)
```javascript
class RequestHandler {
    handle(req) { console.log(`Serving payload: ${req.url}`); }
}

class AuthDecorator {
    constructor(handler) { this.handler = handler; }
    handle(req) {
        if (!req.token) throw new Error("401 Unauthorized");
        this.handler.handle(req);
    }
}
```

---

### 10. Facade Pattern
* **Intent:** Provide a unified, simplified interface to a complex set of subsystem classes.

#### Scenario 1: Online E-Commerce Checkout
```javascript
class InventoryService { checkStock(productId) { return true; } }
class PaymentGateway { chargeCreditCard(userId, amount) { return true; } }
class ShippingService { dispatchParcel(productId, address) { return "TRACK-991"; } }
class EmailConfirmationService { sendReceipt(userId) { console.log("Email sent!"); } }

// The Facade
class OrderCheckoutFacade {
    constructor() {
        this.inventory = new InventoryService();
        this.payment = new PaymentGateway();
        this.shipping = new ShippingService();
        this.email = new EmailConfirmationService();
    }

    placeOrder(userId, productId, amount, address) {
        console.log("=== Initiating 1-Click Order Placement ===");
        if (!this.inventory.checkStock(productId)) throw new Error("Out of stock!");
        this.payment.chargeCreditCard(userId, amount);
        const trackingNum = this.shipping.dispatchParcel(productId, address);
        this.email.sendReceipt(userId);
        return { success: true, trackingNum };
    }
}
```

#### Scenario 2: Video Transcoder Facade
```javascript
class AudioExtractor { extract(file) {} }
class VideoBitrateCompressor { compress(file, res) {} }
class SubtitleSyncer { embed(file) {} }

class VideoConversionFacade {
    convertToMP4(rawFile) {
        console.log("Extracting audio, compressing frames, embedding subs...");
        return "final_movie.mp4";
    }
}
```

---

### 11. Flyweight Pattern
* **Intent:** Use sharing to support vast numbers of fine-grained objects efficiently by separating intrinsic (shared) and extrinsic (unique) state.

#### Scenario 1: Forest of 500,000 Trees in a Video Game
```javascript
// Intrinsic Shared State (Tree 3D Model, Bark Texture)
class TreeModelFlyweight {
    constructor(meshData, texturePath) {
        this.meshData = meshData;
        this.texturePath = texturePath;
    }

    renderAt(x, y, scale) {
        // Reuses the identical heavy mesh in GPU memory
        console.log(`Rendering tree with texture ${this.texturePath} at (${x}, ${y}) with scale ${scale}`);
    }
}

// Flyweight Factory
class TreeFactory {
    static #cache = new Map();

    static getTreeModel(meshData, texturePath) {
        const key = `${meshData}_${texturePath}`;
        if (!this.#cache.has(key)) {
            this.#cache.set(key, new TreeModelFlyweight(meshData, texturePath));
        }
        return this.#cache.get(key);
    }
}

// Extrinsic instance (contains only lightweight coordinates)
class ForestTree {
    constructor(x, y, scale, modelFlyweight) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.model = modelFlyweight;
    }

    draw() {
        this.model.renderAt(this.x, this.y, this.scale);
    }
}
```

#### Scenario 2: Text Editor Character Glyphs
```javascript
class CharacterGlyphFlyweight {
    constructor(fontFamily, size) {
        this.fontFamily = fontFamily;
        this.size = size;
    }
}
```

---

### 12. Proxy Pattern
* **Intent:** Provide a surrogate or placeholder for another object to control access to it.

#### Scenario 1: Caching API Proxy
```javascript
class ThirdPartyWeatherAPI {
    fetchWeather(city) {
        console.log(`[NETWORK CALL] Fetching expensive satellite data for ${city}...`);
        return { city, temp: 24, condition: "Sunny" };
    }
}

class CachedWeatherProxy {
    constructor(api) {
        this.api = api;
        this.cache = new Map();
        this.cacheTTL = 5000; // 5 seconds
    }

    fetchWeather(city) {
        const now = Date.now();
        if (this.cache.has(city)) {
            const entry = this.cache.get(city);
            if (now - entry.timestamp < this.cacheTTL) {
                console.log(`[CACHE HIT] Returning saved weather for ${city}`);
                return entry.data;
            }
        }

        const freshData = this.api.fetchWeather(city);
        this.cache.set(city, { data: freshData, timestamp: now });
        return freshData;
    }
}
```

#### Scenario 2: Protection / Role-Based Access Proxy
```javascript
class FinancialLedger {
    writeOffDebt(amount) { console.log(`Wrote off $${amount} in ledger.`); }
}

class ProtectedLedgerProxy {
    constructor(ledger, currentUserRole) {
        this.ledger = ledger;
        this.role = currentUserRole;
    }

    writeOffDebt(amount) {
        if (this.role !== "CFO") {
            throw new Error("Access Denied: Only the CFO can write off debt.");
        }
        this.ledger.writeOffDebt(amount);
    }
}
```

---

## C. Behavioral Patterns

---

### 13. Strategy Pattern
* **Intent:** Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.

#### Scenario 1: Ride-Sharing Surge Pricing (Uber)
```javascript
class PricingStrategy {
    calculateFare(baseKm) { throw new Error("Required"); }
}

class StandardPricing extends PricingStrategy {
    calculateFare(baseKm) { return baseKm * 1.5; }
}

class RainySurgePricing extends PricingStrategy {
    calculateFare(baseKm) { return baseKm * 2.2; }
}

class NewYearMidnightSurge extends PricingStrategy {
    calculateFare(baseKm) { return baseKm * 3.5 + 10; }
}

class RideBooking {
    constructor(distanceKm, pricingStrategy) {
        this.distanceKm = distanceKm;
        this.strategy = pricingStrategy;
    }

    setStrategy(strategy) { this.strategy = strategy; }

    getFinalCost() {
        return this.strategy.calculateFare(this.distanceKm);
    }
}
```

#### Scenario 2: Data Compression Algorithms
```javascript
class ZipCompression { compress(file) { console.log("Compressed via ZIP"); } }
class RarCompression { compress(file) { console.log("Compressed via RAR"); } }

class Archiver {
    setAlgorithm(algo) { this.algo = algo; }
    createArchive(file) { this.algo.compress(file); }
}
```

---

### 14. State Pattern
* **Intent:** Allow an object to alter its behavior when its internal state changes.

#### Scenario 1: Vending Machine Lifecycle
```javascript
class VendingMachine {
    constructor() {
        this.noCoinState = new NoCoinState(this);
        this.hasCoinState = new HasCoinState(this);
        this.dispensingState = new DispensingState(this);

        this.currentState = this.noCoinState;
    }

    setState(state) { this.currentState = state; }

    insertCoin() { this.currentState.insertCoin(); }
    selectDrink() { this.currentState.selectDrink(); }
    dispense() { this.currentState.dispense(); }
}

class NoCoinState {
    constructor(machine) { this.machine = machine; }
    insertCoin() {
        console.log("Coin accepted!");
        this.machine.setState(this.machine.hasCoinState);
    }
    selectDrink() { console.log("Please insert a coin first."); }
    dispense() { console.log("Payment needed."); }
}

class HasCoinState {
    constructor(machine) { this.machine = machine; }
    insertCoin() { console.log("Coin already inserted."); }
    selectDrink() {
        console.log("Drink chosen!");
        this.machine.setState(this.machine.dispensingState);
        this.machine.dispense();
    }
    dispense() { console.log("Select drink first."); }
}

class DispensingState {
    constructor(machine) { this.machine = machine; }
    insertCoin() { console.log("Wait, dispensing in progress."); }
    selectDrink() { console.log("Already dispensing."); }
    dispense() {
        console.log("Can drops into collection bin! Thank you.");
        this.machine.setState(this.machine.noCoinState);
    }
}
```

#### Scenario 2: Document Approval Workflow (Draft $\to$ Review $\to$ Published)
```javascript
class DraftState { publish() { console.log("Draft sent to Editor for review."); } }
class ReviewState { publish() { console.log("Editor approved. Document is live on web!"); } }
```

---

### 15. Observer Pattern (Pub-Sub)
* **Intent:** Define a one-to-many dependency so that when one object changes state, all its dependents are notified automatically.

#### Scenario 1: YouTube Channel Notifications
```javascript
class YouTubeChannel {
    constructor(channelName) {
        this.channelName = channelName;
        this.subscribers = [];
    }

    subscribe(userObserver) { this.subscribers.push(userObserver); }
    unsubscribe(userObserver) {
        this.subscribers = this.subscribers.filter(sub => sub !== userObserver);
    }

    uploadVideo(title) {
        console.log(`\nChannel [${this.channelName}] uploaded: "${title}"`);
        this.notifyAll(title);
    }

    notifyAll(videoTitle) {
        this.subscribers.forEach(sub => sub.update(this.channelName, videoTitle));
    }
}

class UserSubscriber {
    constructor(userName) { this.userName = userName; }
    update(channel, title) {
        console.log(`Notification for ${this.userName}: New video on ${channel} -> "${title}"`);
    }
}
```

#### Scenario 2: Live Stock Ticker
```javascript
class StockExchange {
    constructor() { this.listeners = []; }
    register(listener) { this.listeners.push(listener); }
    priceChange(ticker, newPrice) {
        this.listeners.forEach(l => l.onTick(ticker, newPrice));
    }
}
```

---

### 16. Command Pattern
* **Intent:** Encapsulate a request as an object, letting you parameterize clients with queues, logs, and **undo/redo**.

#### Scenario 1: Text Editor Undo/Redo Engine
```javascript
class EditorTextDocument {
    constructor() { this.content = ""; }
    write(text) { this.content += text; }
    erase(length) { this.content = this.content.slice(0, -length); }
}

class WriteCommand {
    constructor(doc, textToAdd) {
        this.doc = doc;
        this.textToAdd = textToAdd;
    }
    execute() { this.doc.write(this.textToAdd); }
    undo() { this.doc.erase(this.textToAdd.length); }
}

class CommandHistoryInvoker {
    constructor() { this.undoStack = []; }

    run(command) {
        command.execute();
        this.undoStack.push(command);
    }

    undo() {
        const cmd = this.undoStack.pop();
        if (cmd) cmd.undo();
    }
}
```

#### Scenario 2: Smart Home Remote with Macro Replays
```javascript
class StereoTurnOnCommand {
    constructor(stereo) { this.stereo = stereo; }
    execute() { this.stereo.on(); }
    undo() { this.stereo.off(); }
}
```

---

### 17. Chain of Responsibility Pattern
* **Intent:** Pass requests along a chain of handlers until one or more handlers process the request.

#### Scenario 1: ATM Cash Dispenser ($100 $\to$ $50 $\to$ $20 Bills)
```javascript
class CashDispenserHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    dispense(amount) {
        if (this.nextHandler) this.nextHandler.dispense(amount);
    }
}

class BillDispenser extends CashDispenserHandler {
    constructor(billValue) {
        super();
        this.billValue = billValue;
    }

    dispense(amount) {
        if (amount >= this.billValue) {
            const count = Math.floor(amount / this.billValue);
            const remainder = amount % this.billValue;
            console.log(`Dispensing ${count} x $${this.billValue} bill(s)`);
            if (remainder > 0 && this.nextHandler) {
                this.nextHandler.dispense(remainder);
            }
        } else if (this.nextHandler) {
            this.nextHandler.dispense(amount);
        }
    }
}

// Chain assembly:
const dispenser100 = new BillDispenser(100);
const dispenser50 = new BillDispenser(50);
const dispenser20 = new BillDispenser(20);

dispenser100.setNext(dispenser50).setNext(dispenser20);

console.log("Withdrawal of $370:");
dispenser100.dispense(370);
// Output: 3 x $100, 1 x $50, 1 x $20
```

#### Scenario 2: Web Server Middleware Request Authentication
```javascript
class RateLimitCheck extends CashDispenserHandler {}
class AuthTokenCheck extends CashDispenserHandler {}
class SanitizeBodyCheck extends CashDispenserHandler {}
```

---

### 18. Iterator Pattern
* **Intent:** Access elements of a collection sequentially without exposing its internal representation.

#### Scenario 1: Custom Binary Tree Traversal
```javascript
class TreeCollection {
    constructor(items) { this.items = items; }

    [Symbol.iterator]() {
        let index = 0;
        const items = this.items;
        return {
            next() {
                if (index < items.length) {
                    return { value: items[index++], done: false };
                }
                return { done: true };
            }
        };
    }
}

const team = new TreeCollection(["Alice", "Bob", "Charlie"]);
for (const member of team) {
    console.log(member); // Uses native JS iterator protocol
}
```

#### Scenario 2: Playlist Shuffler Iterator
```javascript
class ShuffledPlaylistIterator {
    // Sequentially yields random unplayed songs
}
```

---

### 19. Mediator Pattern
* **Intent:** Define an object that encapsulates how a set of objects interact, preventing chaotic $N \times N$ cross-coupling.

#### Scenario 1: Chat Room Server
```javascript
class ChatRoomMediator {
    constructor() { this.users = []; }

    register(user) {
        this.users.push(user);
        user.room = this;
    }

    sendMessage(sender, message) {
        this.users
            .filter(u => u !== sender)
            .forEach(u => u.receive(sender.name, message));
    }
}

class ChatUser {
    constructor(name) {
        this.name = name;
        this.room = null;
    }

    send(msg) { this.room.sendMessage(this, msg); }
    receive(from, msg) { console.log(`[${this.name}'s screen] ${from}: "${msg}"`); }
}
```

#### Scenario 2: Air Traffic Control (ATC) Tower
```javascript
class AirportTowerMediator {
    requestLandingClearance(airplane) {
        console.log(`Tower clearing Runway 1 for Flight ${airplane.flightNumber}`);
    }
}
```

---

### 20. Memento Pattern
* **Intent:** Capture and externalize an object's internal state without violating encapsulation, allowing restoration later.

#### Scenario 1: Game Checkpoint Save-State
```javascript
class PlayerStateMemento {
    constructor(health, level, checkpoint) {
        this.health = health;
        this.level = level;
        this.checkpoint = checkpoint;
        Object.freeze(this); // Immutable snapshot
    }
}

class VideoGamePlayer {
    constructor() {
        this.health = 100;
        this.level = 1;
        this.checkpoint = "Forest Entrance";
    }

    takeDamage(pts) { this.health -= pts; }
    advanceTo(checkpoint) { this.checkpoint = checkpoint; this.level++; }

    createSaveCheckpoint() {
        return new PlayerStateMemento(this.health, this.level, this.checkpoint);
    }

    restoreFromMemento(memento) {
        this.health = memento.health;
        this.level = memento.level;
        this.checkpoint = memento.checkpoint;
        console.log(`Restored player state from ${this.checkpoint}!`);
    }
}
```

#### Scenario 2: Database Transaction Rollback
```javascript
class DBRowMemento { constructor(state) { this.state = { ...state }; } }
```

---

### 21. Template Method Pattern
* **Intent:** Define the skeleton of an algorithm in a method, deferring specific steps to subclasses.

#### Scenario 1: Brewing Beverages (Coffee vs. Tea)
```javascript
class BeverageMakerTemplate {
    // The Template Method
    prepareRecipe() {
        this.boilWater();
        this.brew();
        this.pourInCup();
        this.addCondiments();
    }

    boilWater() { console.log("Boiling pure filtered water at 100°C."); }
    pourInCup() { console.log("Pouring beverage into ceramic mug."); }

    brew() { throw new Error("Subclass must implement brew()"); }
    addCondiments() { throw new Error("Subclass must implement addCondiments()"); }
}

class TeaMaker extends BeverageMakerTemplate {
    brew() { console.log("Steeping Earl Grey tea leaves for 4 minutes."); }
    addCondiments() { console.log("Adding slice of lemon."); }
}

class CoffeeMaker extends BeverageMakerTemplate {
    brew() { console.log("Dripping boiling water through finely ground coffee beans."); }
    addCondiments() { console.log("Adding oat milk and brown sugar."); }
}
```

#### Scenario 2: Data Pipeline ETL (JSON vs. CSV)
```javascript
class ETLPipelineTemplate {
    run(file) {
        const raw = this.read(file);
        const parsed = this.parse(raw);
        this.save(parsed);
    }
}
```

---

### 22. Visitor Pattern
* **Intent:** Represent an operation to be performed on elements of an object structure without modifying the element classes.

#### Scenario 1: Tax Audit Visitor on Financial Assets
```javascript
class RealEstateAsset {
    constructor(marketValue) { this.marketValue = marketValue; }
    accept(visitor) { visitor.visitRealEstate(this); }
}

class CryptoAsset {
    constructor(tokenBalance, tokenPrice) {
        this.tokenBalance = tokenBalance;
        this.tokenPrice = tokenPrice;
    }
    accept(visitor) { visitor.visitCrypto(this); }
}

// Visitor
class TaxAssessmentVisitor {
    constructor() { this.totalTax = 0; }

    visitRealEstate(asset) {
        const tax = asset.marketValue * 0.015; // 1.5% property tax
        this.totalTax += tax;
    }

    visitCrypto(asset) {
        const tax = (asset.tokenBalance * asset.tokenPrice) * 0.30; // 30% capital gains
        this.totalTax += tax;
    }
}
```

#### Scenario 2: Document Export Visitor (Export to PDF or Markdown)
```javascript
class ParagraphElement { accept(v) { v.visitParagraph(this); } }
class HeaderElement { accept(v) { v.visitHeader(this); } }
```

---

### 23. Interpreter Pattern
* **Intent:** Define a grammar representation for a language and an interpreter to deal with this grammar.

#### Scenario 1: Math Expression Evaluator
```javascript
class NumberExpression {
    constructor(value) { this.value = value; }
    interpret() { return this.value; }
}

class AddExpression {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    interpret() { return this.left.interpret() + this.right.interpret(); }
}

// Expression: 5 + (10 + 20)
const expr = new AddExpression(
    new NumberExpression(5),
    new AddExpression(new NumberExpression(10), new NumberExpression(20))
);
console.log(`Evaluated Result: ${expr.interpret()}`); // 35
```

#### Scenario 2: SQL Where Clause Filter Evaluator
```javascript
class EqualsExpression {
    constructor(field, expected) { this.field = field; this.expected = expected; }
    interpret(record) { return record[this.field] === this.expected; }
}
```

---

# Level 6: Concurrency & Race Conditions in Node.js

Although JavaScript runs on a single-threaded event loop, **asynchronous operations (`async/await`, database transactions, file writes) create real race conditions!**

---

### 1. The Async "Check-Then-Act" Race Condition
```javascript
// ❌ BUG: Two concurrent web requests can book the same hotel room!
class HotelBookingServiceBroken {
    constructor() { this.bookedRooms = new Set(); }

    async bookRoom(roomNumber, user) {
        // Step 1: Check availability
        if (this.bookedRooms.has(roomNumber)) return false;

        // Step 2: Asynchronous DB latency simulation (100ms)
        await new Promise(r => setTimeout(r, 100));

        // Step 3: Act (Both Alice and Bob reached here simultaneously!)
        this.bookedRooms.add(roomNumber);
        console.log(`Room ${roomNumber} assigned to ${user}`);
        return true;
    }
}
```

---

### 2. Solving Race Conditions in JavaScript: Async Mutex Lock
```javascript
class AsyncMutex {
    #queue = [];
    #locked = false;

    async acquire() {
        if (!this.#locked) {
            this.#locked = true;
            return;
        }
        return new Promise(resolve => this.#queue.push(resolve));
    }

    release() {
        if (this.#queue.length > 0) {
            const nextInLine = this.#queue.shift();
            nextInLine(); // Wake up next pending operation
        } else {
            this.#locked = false;
        }
    }
}

// ✅ THREAD-SAFE CONCURRENT BOOKING
class SafeHotelBookingService {
    #bookedRooms = new Set();
    #mutex = new AsyncMutex();

    async bookRoom(roomNumber, user) {
        await this.#mutex.acquire();
        try {
            if (this.#bookedRooms.has(roomNumber)) {
                console.log(`Sorry ${user}, Room ${roomNumber} is already booked.`);
                return false;
            }

            await new Promise(r => setTimeout(r, 100)); // DB latency
            this.#bookedRooms.add(roomNumber);
            console.log(`Room ${roomNumber} secured for ${user}!`);
            return true;
        } finally {
            this.#mutex.release(); // Always release lock
        }
    }
}
```

---

# Level 7: The LLD Interview Blueprint

Follow this 5-step template in every 45-minute LLD interview:

```
[Minute 00-05] Clarify Functional Scope & Boundaries
               -> Who are the actors? (Admin, Customer, Driver)
               -> What are the essential operations? (e.g., Park, Unpark, Pay)

[Minute 05-12] List Entities, Enums, and Attributes
               -> Real-world nouns: Spot, Floor, Vehicle, Ticket, Gate

[Minute 12-20] Choose Matching Design Patterns
               -> Dynamic rule?  -> Strategy (Pricing, Allocation)
               -> State machine? -> State (Vending Machine, ATM)
               -> Broadcast?     -> Observer (Display boards, notifications)

[Minute 20-40] Write Clean, Modular JavaScript Code
               -> Apply private fields (#), SRP classes, and clean method names

[Minute 40-45] Verify Concurrency & Extensibility
               -> What happens if two drivers hit the gate at the exact same millisecond?
```

### Complete Pattern-Matching Matrix

| System Characteristic | Best Pattern | Concrete LLD Example |
| :--- | :--- | :--- |
| Dynamic policies / interchangeable algorithms | **Strategy** | Surge pricing in Uber, Spot allocation in Parking Lot |
| Lifecycle state transitions | **State** | Vending Machine states, Order delivery pipeline |
| Event broadcasts / notification feeds | **Observer** | CricInfo scoreboard, YouTube subscribers |
| Flexible object creation | **Factory / Builder** | Vehicle Factory, Custom PC Builder |
| Additive layers / wrappers | **Decorator** | Coffee condiments, Express middleware |
| Tree structures | **Composite** | File Directory System, Organization Chart |
| Stepwise workflows with undo | **Command + Memento**| Text Editor, Chess game undo |
| Multi-level delegation | **Chain of Responsibility**| ATM bill dispenser ($100 $\to$ $50 $\to$ $20) |
| Central communication hub | **Mediator** | Chat room server, Air traffic control |