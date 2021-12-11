import wavePortalAbi from "./utils/WavePortal.json";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';
import Loader from 'react-loader-spinner';
const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mined, setMined] = useState(false);
  const contractAddress = "0xaC0067a300b1C115C7334c988878Da343181a086";
  const contractABI = wavePortalAbi.abi;

  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log('NewWave', from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on('NewWave', onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off('NewWave', onNewWave);
    }
  };
}, []);
  
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }
const getValue = async (event) =>{
    setInputValue(event.target.value);
}

const wave = async (event) => {
    setMined(false);
    setLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(inputValue, { gasLimit: 500000 });
        console.log("Mining...", waveTxn.hash);
        // set loading True
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        setInputValue("")
        setLoading(false);
        setMined(true);
        //set loading to False

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        🤗 Welcome 🤗
        </div>

        <div className="bio">
          Hello World! This is <a target="_blank" href='https://twitter.com/rouzbehshirvani'>Rouzbeh Shirvani</a> speaking to you. Well, this is my first shot at building a decentralized application. 
        </div>

        <div className="bio">
        <b>What's going on here?</b> We are deploying a smart contract in this web interface. Here are the steps that went into play.
        <ol className='stepsContract'>
        <li>Wrote a small contract on our computer. A smart contract is a contract that is written by a piece of software.</li>
        <li>Deployed the smart contract to the blockchain network on the internet</li>
        <li>Add the contract id to your web interface</li>
        <li>Build an application based on the contract</li> 
        </ol>
        </div>

        <div className="bio">
        <b>What's the application?</b> We will be asking you to go through the following steps:
        <ol className='stepsContract'>
        <li>Connect the Wallet</li>
        <li>Write a message and wave at us</li>
        <li>There is a 50% chance that you might win 0.00001 of fake Ethereum</li>
        <li>Unfortunately we cannot afford to let you do this indefinitely, as a result we are going to put a 30 minutes gap between the two consecutive waves. </li> 
        </ol>
        </div>

        

        {currentAccount && (<div className="submitForm">
            <div><input type='text' className="messageBox" placeholder='type your message' onChange={getValue} value={inputValue} type="text"/></div>
            <div>

            <button onClick={wave}className="waveButton"> Wave at me 
            </button>
            
            </div>
        </div>)}


        {!currentAccount && (
          <div className="submitForm"><button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button></div>
        )}

        {loading ? (
          <div className="waveMining">
          Waiting to be Mined
          <Loader type="Circles" color="#00BFFF" height={80} width={80}/>
          </div>
          ): (null)}
        
        {mined?
          (
          <div className="waveMined">
          Successfully Mined!
          </div>
          ):(null)}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
        <div className="bio">
        All the thanks should go to the Buildspace team and <a target="_blank" href="https://twitter.com/FarzaTV?s=20">Farza</a> for creating this platform.
        </div>
  
      </div>
      
    </div>
  );
}

export default App