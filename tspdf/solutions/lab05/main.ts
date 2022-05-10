
const DEFAULT_COUNTRY_CODE = 'NL';
const DEFAULT_BANK_CODE = 'TYPE';
const CHAR_CODE_A = 'A'.charCodeAt(0);
const CHAR_CODE_Z = 'Z'.charCodeAt(0);
const OFFSET_LATIN_CHARACTER = 55;

function formatName(firstName: string, lastName: string, insertion?: string): string {
  if (insertion) {
    return `${firstName} ${insertion} ${lastName}`;
  } else {
    return `${firstName} ${lastName}`;
  }
}

console.log(formatName('Pascalle', 'Vries', 'de'));
console.log(formatName('Foo', 'Bar'));

function generateIban(
  bankCode = DEFAULT_BANK_CODE,
  countryCode = DEFAULT_COUNTRY_CODE,
  accountNumber = Math.floor(Math.random() * 10000000000).toString()) {
  return {
    countryCode,
    bankCode,
    accountNumber,
    controlNumber: controlNumber()
  };
  function controlNumber() {
    const accountNumberInteger = `${convert(bankCode)}${accountNumber}${convert(countryCode)}00`;
    return Number(98n - BigInt(accountNumberInteger) % 97n);
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

function formatIban({ countryCode, controlNumber, bankCode, accountNumber }: any) {
  const unFormatted = `${countryCode}${controlNumber < 10 ? `0${controlNumber}` : controlNumber}${bankCode}${accountNumber}`;
  const parts: string[] = [];
  for (let i = 0; i < unFormatted.length; i += 4) {
    parts.push(unFormatted.substr(i, 4));
  }
  return parts.join(' ');
}

const ibanTypedBank = generateIban();
const ibanIng = generateIban('INGB', 'NL');
const ibanDeutscheBank = generateIban('DEUT', 'DE');
console.log(formatIban(ibanTypedBank));
console.log(formatIban(ibanIng));
console.log(formatIban(ibanDeutscheBank));

