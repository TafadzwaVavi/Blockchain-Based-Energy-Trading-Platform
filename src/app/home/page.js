"use client"
import styles from './styles.css';
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Web3 from 'web3';
import 'bulma/css/bulma.css';
import tradingContract from '../../blockchain/vending';
import { useEffect, useState } from 'react';
import '../globals.css';
import { getSession, signIn } from 'next-auth/react';
import page from '../(auth)/sign-in/page';


// Define the columns for the table
const columns = [
  { key: "owner", label: "Owner" },
  { key: "price", label: "Price" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
];

//const web3 = new Web3(window.ethereum); 

// Create a web3 instance using the window.ethereum provider (MetaMask)
//const web3 = new Web3(window.ethereum);
try {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    // Rest of your code...
  } catch (error) {
    console.error('Error initializing Web3:', error);
  }

const EnergyTrading =() => {
  const [user, setUser] = useState(null);
  const [Loading, setLoading] = useState(true);


    const [myExcessEnergy, setmyExcessEnergy] = useState(null)
    const [error, setErrror] = useState('')
    const [web3, setWeb3] = useState(null);
    const [myEnergyToken, setEnergyToken] = useState(null)
    const [address, setAddress] = useState(null)
    const [trContract, settradingContract] = useState(null)
    const [response, setResponse] = useState('');
    const [deductValue, setDeductValue] = useState('');
    const [addValue, setAddValue] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [askIndex, setAskIndex] = useState('');
    const [remIndex, setRemIndex] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const priceInt = parseInt(price, 10);
    const amountInt = parseInt(amount, 10);
    //const timestampInt = parseInt(getCurrentDateTime(), 10);

    useEffect(() => {
         // Fetch session data from the server
         const securepage  = async()  => {
          const session  = await getSession()
          if(!session){
            page()
          }
          else{
            setLoading(false)
          }

         }
         getCurrentDateTime();
         if (trContract) getmyExtraEnergyHandler()
         if (trContract) getAsksHandler()
         if (trContract) getBidsHandler()
         

         securepage();
        }, [trContract, address,])

        if (Loading){
          return (<div><h2>Loading...</h2>
          <h3>Please log in</h3></div>)
        }
        function padTo2Digits(num) {
          return num.toString().padStart(2, '0');
        }
        
        // Function to format the date and time
        function getCurrentDateTime() {
          // Get the current date and time
          const now = new Date();
        
          // Calculate the Unix timestamp in seconds
          const unixTimestamp = Math.floor(now.getTime() / 1000);
        
          // Return the Unix timestamp as a uint256
          return unixTimestamp;
        }
        const payForAskHandler = async() =>{   
          const asks = await trContract.methods.getAllAsks().call();
          const me = asks[askIndex].price*asks[askIndex].amount;
         
          const etherAmount = web3.utils.toWei(me, 'ether');          
          try {
            await trContract.methods.payForAsk(askIndex).send({
                from: address,                
                value: etherAmount
            });
            console.log('Transaction receipt:');
        } catch (error) {
            console.error('Error executing transaction:', error.message);
        }    
        connectWalletHandler()
      getmyExtraEnergyHandler()
      getAsksHandler()
      getBidsHandler()

        }
        const displayBidsInTable = (bids) => {
          const tablee = document.getElementById('tableBids');
      
          // Clear existing rows (if any)
          tablee.innerHTML = "";
          
      
          // Create table header
          const headerRow = tablee.insertRow();
          const headers = ["Index", "Owner", "Price", "Amount", "Date"];
          headers.forEach((header) => {
              const cell = headerRow.insertCell();
              cell.innerHTML = header;
          });
      
          // Populate table with bids
          bids.forEach((bid, index) => {
              const row = tablee.insertRow();
              const { owner, price, amount, date } = bid;
      
              // Insert data into cells
              const positionCell = row.insertCell();
              positionCell.innerHTML = index;

              const ownerCell = row.insertCell();
              ownerCell.innerHTML = owner;
      
              const priceCell = row.insertCell();
              priceCell.innerHTML = price;
      
              const amountCell = row.insertCell();
              amountCell.innerHTML = amount;
      
              const dateCell = row.insertCell();
                // Format the date and time in a human-readable format
                const dateObject = new Date(Number(date) * 1000);
                const formattedDate = dateObject.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) + ' ' + dateObject.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false // Use 24-hour format
                });

                dateCell.innerHTML = formattedDate; // Convert timestamp to human-readable date



});
      };
      
      const getBidsHandler = async () => {
         try {
              const bids = await trContract.methods.getAllBids().call();
             // const Asks = await trContract.methods.getAllAsks().call()
              displayBidsInTable(bids);
          } catch (error) {
              console.error("Error fetching bids:", error);
          }
      };
      
 
      const displayAsksInTable = (asks) => {
          const table = document.getElementById("asksTable");
      
          // Clear existing rows (if any)
          table.innerHTML = "";
      
          // Create table header
          const headerRow = table.insertRow();
          const headers = ["Index", "Owner", "Price", "Amount", "Date"];
          headers.forEach((header) => {
              const cell = headerRow.insertCell();
              cell.innerHTML = header;
          });
      
          // Populate table with asks
          asks.forEach((ask, index) => {
              const row = table.insertRow();
              const { owner, price, amount, date } = ask;
      
              // Insert data into cells
              const positionCell = row.insertCell();
              positionCell.innerHTML = index;

              const ownerCell = row.insertCell();
              ownerCell.innerHTML = owner;
      
              const priceCell = row.insertCell();
              priceCell.innerHTML = price;
      
              const amountCell = row.insertCell();
              amountCell.innerHTML = amount;
      
              const dateCell = row.insertCell();
              //dateCell.innerHTML = date; // Convert timestamp to human-readable date
              const dateObject = new Date(Number(date) * 1000);

                // Format the date and time in a human-readable format
                const formattedDate = dateObject.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) + ' ' + dateObject.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false // Use 24-hour format
                });

                dateCell.innerHTML = formattedDate;
          });
      };  
      const getAsksHandler = async() =>{
        try {
          const Asks = await trContract.methods.getAllAsks().call()
          displayAsksInTable(Asks);
        }
        catch (error) {
          console.error("Error fetching asks:", error);
          
        }

      }
      const placeBidHandler = async () => {
        getAsksHandler()
        
        
        const timestampInt = getCurrentDateTime();
        console.log(`Price: ${price}, Amount: ${amount}, Timestamp: ${timestampInt}`);
        //console.log(trContract); // Should log the contract instance, not null
        try {
            // Invoke the placeBid function on the tradingContract
                     
            await trContract.methods.placeBid(priceInt, amountInt, timestampInt).send({
                from: address,
                
                //value: 0,
                gas: 5000000
            });           
    
           console.log("Bid placed successfully");
        } catch (error) {
            console.error('Error placing bid:', error);
            
        }
        connectWalletHandler()
        getBidsHandler()
    };
    const placeAskHandler = async () => {
      const timestampInt = getCurrentDateTime();
      
      console.log(`Price: ${price}, Amount: ${amount}, Timestamp: ${timestamp}`);
      console.log(trContract); // Should log the contract instance, not null
      try {
          // Invoke the placeAsk function on the tradingContract
          // The 'from' field is automatically set by web3.js based on the account you're using
          
          await trContract.methods.placeAsk(priceInt, amountInt, timestampInt).send({
              from: address,      
              
          });
  
          console.log("Ask placed successfully");
         
      } catch (error) {
          console.error('Error placing ask:', error);
      }
      connectWalletHandler()
      getmyExtraEnergyHandler()
        getAsksHandler()
        getBidsHandler()
  };
    const getmyExtraEnergyHandler = async() => 
    
    {
      
      try {
      const energyTkn = await trContract.methods.getEnergyTokens().call({from: address});
      const energy = await trContract.methods.getEnergyBankBalance().call({from: address});
      console.log(energy);
      setmyExcessEnergy(energy)
      setEnergyToken(energyTkn)
    } catch (error) {
      console.error("Error calling getEnergyBankBalance:", error);
    }        
        }
        //dummy function to symbolise extracting energy from meter
    const getEnergyHandler = async (action) => {

      let amou = 20;
      try {  
        
       const tx =  await trContract.methods.getEnergyFromMeter(deductValue).send({
            from: address,       
        });
        
        getmyExtraEnergyHandler ();
        connectWalletHandler()

        console.log("Energy added", tx);
       
    } catch (error) {
        console.error('Error placing ask:', error);
    }
    }


    const handleClick = async (action) => {
      try {
        const value = action === 'getenergy' ? deductValue : addValue;
        const response = await fetch('http://192.168.43.115/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            plain: action,
            value: value || 0,
          }).toString(),
        });
  
        const data = await response.text();
        setResponse(data);
        console.log(data);
        
      } catch (error) {
        console.error(error);
      }
      try {  
        
        const tx =  await trContract.methods.getEnergyFromMeter(deductValue).send({
             from: address,       
         });
         
         getmyExtraEnergyHandler ();
         connectWalletHandler()
 
         console.log("Energy added", tx);
        
     } catch (error) {
         console.error('Error getting values:', error);
     }
    };


    const handleClicks = async (action) => {
      try {
        const value = action === 'getenergy' ? deductValue : addValue;
        const response = await fetch('http://192.168.43.115/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            plain: action,
            value: value || 0,
          }).toString(),
        });
  
        const data = await response.text();
        setResponse(data);
        console.log(data);
        
      } catch (error) {
        console.error(error);
      }
      try {  
        
        const tx =  await trContract.methods.exportToMeter(addValue).send({
             from: address,       
         });
         
         getmyExtraEnergyHandler ();
         connectWalletHandler()
 
         console.log("Recharge successfull", tx);
        
     } catch (error) {
         console.error('Error recharging meter:', error);
     }
    };




    const removeBidHandler = async () => {
      await trContract.methods.removeBid(remIndex).send({
        from: address
      })
      getmyExtraEnergyHandler()
        getAsksHandler()
        getBidsHandler()
    }
    const removeAskHandler = async () => {
      await trContract.methods.removeAsk(remIndex).send({
        from: address
      })
      connectWalletHandler()
      getmyExtraEnergyHandler()
      getAsksHandler()
      getBidsHandler()
    }
    const connectWalletHandler = async () => {
      getCurrentDateTime();

        // Your wallet connection logic
            if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
              try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
                const Instance = new Web3(window.ethereum);
                  //setWeb3(new Web3(window.ethereum));
                  setWeb3(Instance)
                  // list accounts
                 const accounts = await Instance.eth.getAccounts()
                  console.log('Connected accounts:', accounts);
                  setAddress(accounts[0])
                  // contract instance
                  const vm = tradingContract(Instance)
                  settradingContract(vm)
              }
              catch(err){
                setErrror(err.message)
                console.log(err)
               }
            } else {
              console.log("Please install MetaMask");
            }
          
      };
      
        return (
          
            <div className='mainn'>
              <Head>
                <title>Energy Trading Platform</title>
                <meta name="description" content="A blockchain energy trading" />   
              </Head>
              
                <div className="firsttwoBtn">
                    <button onClick={connectWalletHandler} className="conButton"> Connect Wallet</button>
                </div>
              
              <section>
                <div className="container">
                  <h2>Energy Available for trade: {myExcessEnergy ? myExcessEnergy.toString() : 'Loading...'}</h2> 
                </div>
              </section>
              <section>
                <div className="container">
                  <h2>My Energy tokens:  {myEnergyToken ? myEnergyToken.toString() : 'Loading...'}</h2>
                </div>
              </section>
              <section className='me'>
              
                <div className='button-input-group'>
                  <button onClick={() => handleClick('getenergy')} className="normBtn">Load excess Energy</button>
                  <input type="number" value={deductValue} onChange={(e) => setDeductValue(e.target.value)} placeholder="Enter value to transfer" />
                </div>
                <div className='button-input-group'>
                  <button onClick={() => handleClicks('addenergy')} className="normBtn">Recharge Meter now</button>
                  <input type="number" value={addValue} onChange={(e) => setAddValue(e.target.value)} placeholder="Enter units to recharge" />
                </div>
              </section>
              
                <div className="controll">
                  <div className='fieldf'>
                    <button onClick={placeBidHandler} className='normBtn'>Place Bid</button>
                    <button onClick={placeAskHandler} className="normBtn">place ask</button>
                    <p></p>
                  </div>
                    <div className="controls">
                      
                      <input  className="inputt" type = "type" placeholder='Enter amount' value={amount} onChange={(e) => setAmount(e.target.value)}/>
                      <input  className="inputt" type = "type" placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)}/>
                      
                    </div>
                    <p>
                    </p>
                  </div> 
              
              <section>
                <div className="container">
                <h2>Current Bids</h2>
                <table id='tableBids'>
                </table>
                </div>
              </section>
              <section>
                <div className="container">
                <h2>Current Asks</h2>
                <table id='asksTable'>
                </table>
                </div>
              </section>
              <section>
              <button onClick={payForAskHandler} className="normBtn">Pay for an Ask</button>
              <input  className="inputt" type = "type" placeholder='Enter AskIndex' value={askIndex} onChange={(e) => setAskIndex(e.target.value)}/>
                <div className="container has-text-danger">
                  <p>{error}</p>
                </div>
              </section>
              <section>
              <div className='fieldff'>
                <button onClick={removeAskHandler} className="remBtn">Remove Ask</button>
                <input  className="inputt" type = "type" placeholder='Enter Enter index of item to remove' value={remIndex} onChange={(e) => setRemIndex(e.target.value)}/>
                <button onClick={removeBidHandler} className="remBtn">Remove Bid</button>
              </div>
             
                <div className="container has-text-success">
                  <p>success msg</p>
                </div>
              </section>
              
              
              
            </div>
          );
        
    

    
};
    
    export default EnergyTrading;