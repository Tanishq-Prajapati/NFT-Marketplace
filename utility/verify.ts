import {run} from "hardhat";

const verifyContract = async(
    address: string,
    c_args: (string | number | boolean)[]
) => {
    console.log("Verifying contract with addr ->",address);
    try{
        await run("verify:verify",{
            address:address,
            args:c_args
        });
    }
    catch(e){
        let err = e as Error;
        if (String(err.message).toLowerCase().includes("already")){
            console.log("Contract already verified...");
        }
        else{
            console.log(`Error -> ${err.message}`);
        }
    }
    finally{
        console.log("Verification process finished successfully...");
    }
}

export default verifyContract;