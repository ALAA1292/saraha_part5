import * as argon2 from "argon2";

export const hash=(plainText)=>{
 const hash =  argon2.hash(plainText);
return hash;
}


export const compareTwoHashes=(hash,plainText)=>{
        return argon2.verify(hash,plainText)

}