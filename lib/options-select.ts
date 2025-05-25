import { addLeadingZeros } from "@/lib/utils";
import { Option } from "@/lib/model/types";
import { Bandeira, Emissor, EmissorText, BandeiraText } from "@/lib/model/enums";

export const dayOptions: Option[] = Array.from({ length: 31 }, (_, i) => ({
    value: addLeadingZeros(`${i + 1}`, 2),
    label: addLeadingZeros(`${i + 1}`, 2),
}));

export const bandeiraOptions: Option[] = [
    { value: Bandeira.VISA, label: BandeiraText[Bandeira.VISA] },
    { value: Bandeira.MASTERCARD, label: BandeiraText[Bandeira.MASTERCARD] }
];

export const emissorOptions: Option[] = [
    { value: Emissor.ATACADAO, label: EmissorText[Emissor.ATACADAO] },
    { value: Emissor.BANCOBRASIL, label: EmissorText[Emissor.BANCOBRASIL] },
    { value: Emissor.BANCOPAN, label: EmissorText[Emissor.BANCOPAN] },
    { value: Emissor.BRADESCO, label: EmissorText[Emissor.BRADESCO] },
    { value: Emissor.BRASILCARD, label: EmissorText[Emissor.BRASILCARD] },
    { value: Emissor.CAIXA, label: EmissorText[Emissor.CAIXA] },
    { value: Emissor.C6BANK, label: EmissorText[Emissor.C6BANK] },
    { value: Emissor.ITAU, label: EmissorText[Emissor.ITAU] },
    { value: Emissor.MERCADOPAGO, label: EmissorText[Emissor.MERCADOPAGO] },
    { value: Emissor.MIDWAY, label: EmissorText[Emissor.MIDWAY] },
    { value: Emissor.NEON, label: EmissorText[Emissor.NEON] },
    { value: Emissor.NOVUCARD, label: EmissorText[Emissor.NOVUCARD] },
    { value: Emissor.NUBANK, label: EmissorText[Emissor.NUBANK] },
    { value: Emissor.OUZE, label: EmissorText[Emissor.OUZE] },    
    { value: Emissor.RIACHUELO, label: EmissorText[Emissor.RIACHUELO] },
    { value: Emissor.SANTANDER, label: EmissorText[Emissor.SANTANDER] },
];

export const estadoOptions: Option[] = [    
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' },
  ];

export const sexoOptions: Option[] = [    
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' }
];
  