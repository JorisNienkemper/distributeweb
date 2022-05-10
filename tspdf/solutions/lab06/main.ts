
const DEFAULT_COUNTRY_CODE = 'NL';
const DEFAULT_BANK_CODE = 'TYPE';
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);
const OFFSET_LATIN_CHARACTER = 55;

interface Customer {
  firstName: string;
  lastName: string;
  insertion?: string;
}

function formatName(customer: Customer): string {
  if (customer.insertion) {
    return `${customer.firstName} ${customer.insertion} ${customer.lastName}`;
  } else {
    return `${customer.firstName} ${customer.lastName}`;
  }
}

interface Iban {
  countryCode: string;
  bankCode: string;
  accountNumber: string;
  controlNumber: number;
}

interface BankAccount {
  customer: Customer;
  iban: Iban;
  toString(): string;
}

function generateIban(bankCode = DEFAULT_BANK_CODE, countryCode = DEFAULT_COUNTRY_CODE, accountNumber = Math.floor(Math.random() * 10000000000).toString()):
  Iban {
  return {
    countryCode,
    bankCode,
    accountNumber,
    controlNumber: controlNumber()
  };

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

function formatIban({ countryCode, controlNumber, bankCode, accountNumber }: Iban) {
  const unFormatted = `${countryCode}${controlNumber < 10 ? `0${controlNumber}` : controlNumber}${bankCode}${accountNumber}`;
  const parts: string[] = [];
  for (let i = 0; i < unFormatted.length; i += 4) {
    parts.push(unFormatted.substr(i, 4));
  }
  return parts.join(' ');
}

function createBankAccount(customer: Customer): BankAccount {
  return {
    customer,
    iban: generateIban(),
    toString() {
      return `[${formatIban(this.iban)}] ${formatName(this.customer)}`;
    }
  };
}

const bankAccounts = [
  createBankAccount({ firstName: 'Alfred', lastName: 'Kwak', insertion: 'Jodocus' }),
  createBankAccount({ firstName: 'Brad', lastName: 'Pit' }),
  createBankAccount({ firstName: 'Jack', lastName: 'Sparrow' })
];

bankAccounts.forEach(bankAccount => console.log(bankAccount.toString()));