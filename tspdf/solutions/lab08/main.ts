
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);
const OFFSET_LATIN_CHARACTER = 55;

class Customer {
  constructor(
    public firstName: string,
    public lastName: string,
    public insertion?: string
  ) {
  }

  public format(): string {
    if (this.insertion) {
      return `${this.firstName} ${this.insertion} ${this.lastName}`;
    } else {
      return `${this.firstName} ${this.lastName}`;
    }
  }
}

class Iban {
  constructor(
    public readonly countryCode: string,
    public readonly bankCode: string,
    public readonly accountNumber: string,
    public readonly controlNumber: number) {
  }

  format() {
    const unFormatted = `${this.countryCode}${this.controlNumber < 10 ? `0${this.controlNumber}` : this.controlNumber}${this.bankCode}${this.accountNumber}`;
    const parts: string[] = [];
    for (let i = 0; i < unFormatted.length; i += 4) {
      parts.push(unFormatted.substr(i, 4));
    }
    return parts.join(' ');
  }


  static generate(bankCode: string, countryCode: string, accountNumber = Math.floor(Math.random() * 10000000000).toString()): Iban {
    return new Iban(
      countryCode,
      bankCode,
      accountNumber,
      controlNumber()
    );

    function controlNumber() {
      const accountNumberInteger = `${convert(bankCode)}${accountNumber}${convert(countryCode)}00`;
      const control = 98n - BigInt(accountNumberInteger) % 97n;
      return Number(control);
    }

    function convert(chars: string) {
      let result = '';
      for (var i = 0; i < chars.length; i++) {
        if (isCapitalLetter(chars, i)) {
          result += chars.charCodeAt(i) - OFFSET_LATIN_CHARACTER;
        } else {
          result += chars.charAt(i);
        }
      }
      return result;
    }

    function isCapitalLetter(source: string, index = 0) {
      const charCode = source.charCodeAt(index);
      return charCode >= CHAR_CODE_A && charCode <= CHAR_CODE_Z;
    }
  }
}

class BankAccount {
  public iban: Iban;

  constructor(public customer: Customer, bankCode: string, countryCode: string) {
    this.iban = Iban.generate(bankCode, countryCode);
    auditLog(this.iban, 'created');
  }

  toString(): string {
    return `[${this.iban.format()}] ${this.customer.format()}`;
  }
}

interface BankConfig {
  name: string;
  countryCode: string;
  bankCode: string;
}

class Bank {
  private readonly accounts: BankAccount[];
  constructor(private readonly config: BankConfig) {
    this.accounts = [];
  }

  public createAccount(customer: Customer) {
    const newAccount = new BankAccount(customer, this.config.bankCode, this.config.countryCode);
    this.accounts.push(newAccount);
    auditLog(customer, 'assigned');
    console.log(`[${this.config.name}] welcomes ${newAccount}`);
  }
}

const bank = new Bank({ bankCode: 'TYPE', countryCode: 'NL', name: 'Typed bank' });
bank.createAccount(new Customer('Alfred', 'Kwak', 'Jodocus'));
bank.createAccount(new Customer('Brad', 'Pit'));
bank.createAccount(new Customer('Jack', 'Sparrow'));



function auditLog<T extends { format(): string }> (subject: T, action: string) {
  console.log(`[${subject.format()}]: ${action}`);
}