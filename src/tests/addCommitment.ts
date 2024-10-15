import merkleTreeService from '../services/MerkleTreeServiceSingleton';
import { logger } from '../utils/logger';
import axios from 'axios';

// Function to generate a random nullifier between 0 and 1,000,000
const generateRandomNullifier = () => Math.floor(Math.random() * 1_000_000).toString();

// Mock proof object
const createMockProof = (nullifier: string) => ({
    nullifier,
    commitment: Math.floor(Math.random() * 1_000_000).toString(),
    // Add additional fields as needed for your proof structure
});

const mockAttestation = {
    "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://openpassport.app"
    ],
    "type": [
        "OpenPassportAttestation",
        "PassportCredential"
    ],
    "issuer": "https://openpassport.app",
    "issuanceDate": "2024-10-15T01:15:48.445Z",
    "credentialSubject": {
        "userId": "fd158d1a-5e47-4e24-a0d9-2098380f9bbb",
        "application": "scope",
        "nullifier": "be1f41ebdfd94483afd65aabc9ba57a5e5c208aee688fa84fc462e7595e9b6b",
        "scope": "scope",
        "current_date": "2,4,1,0,1,5",
        "blinded_dsc_commitment": "9059158318722320533863124703362323637342398468365020549485084148374604107341",
        "not_in_ofac_list": "0",
        "not_in_countries": [],
        "issuing_state": "",
        "name": "",
        "passport_number": "",
        "nationality": "",
        "date_of_birth": "",
        "gender": "",
        "expiry_date": "",
        "older_than": "",
        "pubKey": [
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
        ]
    },
    "proof": {
        "mode": "register",
        "signatureAlgorithm": "rsa",
        "hashFunction": "sha256",
        "type": "ZeroKnowledgeProof",
        "verificationMethod": "https://github.com/zk-passport/openpassport",
        "value": {
            "proof": {
                "pi_a": [
                    "8342884671472664800310153971608443961625735840142877884177364164483615199546",
                    "18957189976803718371373066599702768205905478957785998606518671613293003225216",
                    "1"
                ],
                "pi_b": [
                    [
                        "15473259887164873455093853201230418440737683116092466056961102230055123953348",
                        "168114066772735497276854523853338705504295117728144366673884726832409362021"
                    ],
                    [
                        "18048871658696572480250492062897074503354172302633816034370385643841387211801",
                        "7008839021620827251863119281885341914145156865325791789111877492553956936252"
                    ],
                    [
                        "1",
                        "0"
                    ]
                ],
                "pi_c": [
                    "21497620004980176254816780164045295440095933909916720149871109932158343600416",
                    "9919365913360566409991339077501457162440756505058612750503435565797299205681",
                    "1"
                ],
                "protocol": "groth16",
                "curve": "bn128"
            },
            "publicSignals": [
                "5374666778906423227182311952456528848804059838391646482024290755389048134507",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "0",
                "8166060404806320489648196957443690879132797291170730227859802698230759012818",
                "9059158318722320533863124703362323637342398468365020549485084148374604107341",
                "2",
                "4",
                "1",
                "0",
                "1",
                "5",
                "336406583076477081157922737239981267899",
                "1115099111112101"
            ]
        },
        "vkey": "https://github.com/zk-passport/openpassport/blob/main/common/src/constants/vkey.ts"
    },
    "dscProof": {
        "signatureAlgorithm": "rsa",
        "hashFunction": "sha256",
        "type": "ZeroKnowledgeProof",
        "verificationMethod": "https://github.com/zk-passport/openpassport",
        "value": {
            "proof": {
                "pi_a": [
                    "2355643303185600908269770514174285989271842884619581981363756657539145312450",
                    "1466768199450512759469146818844876591235367483588324417992659511728018689462",
                    "1"
                ],
                "pi_b": [
                    [
                        "1804433422934562778052089242475149628696625812718711824573245575243557405762",
                        "7967483107933700853754159568638443848273957193246019430897971298188576725699"
                    ],
                    [
                        "9529229679327504480497474338889125454127120789014343579580709767613581422030",
                        "10658678705401446374400293529096114957543520228599983081227920028349287134203"
                    ],
                    [
                        "1",
                        "0"
                    ]
                ],
                "pi_c": [
                    "1112270556627728701728938499381266874193441513874658913177223182583539199405",
                    "6684660422659070084800657870895500003214041013623569980927186389673283690615",
                    "1"
                ],
                "protocol": "groth16"
            },
            "publicSignals": [
                "9059158318722320533863124703362323637342398468365020549485084148374604107341",
                "8501536092052497016667322205992896973542459837563950229347308491258945206347"
            ]
        },
        "vkey": "https://github.com/zk-passport/openpassport/blob/main/common/src/constants/vkey.ts"
    },
    "dsc": {
        "type": "X509Certificate",
        "value": "",
        "encoding": "PEM"
    },
    "userIdType": "uuid"
}

const testAddCommitment = async () => {
    try {
        const response = await axios.post('http://localhost:3300/api/verifier/register', mockAttestation);
        console.log(`Response: ${response.data}`);
    } catch (error: any) {
        if (error.response) {
            console.error(`Error: ${error.response.status} - ${error.response.data}`);
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
};

// Execute the test
testAddCommitment();
