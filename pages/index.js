import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleStorageABI from "../artifacts/contracts/Assessment.sol/SimpleStorage.json";
import styles from '../styles/App.module.css'; // Import the CSS module

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = SimpleStorageABI.abi;

function App() {
    const [number, setNumber] = useState(0);
    const [input, setInput] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, abi, signer);
                setProvider(provider);
                setSigner(signer);
                setContract(contract);
            } else {
                console.log('Ethereum object not found, install MetaMask.');
                alert('Please install MetaMask.');
            }
        };
        init();
    }, []);

    const fetchStoredNumber = async () => {
        const number = await contract.get();
        setNumber(number.toString());
    };

    const updateStoredNumber = async () => {
        const tx = await contract.set(input);
        await tx.wait();
        fetchStoredNumber();
    };

    return (
        <div className={styles.container}>
            <div className={styles.pixel} style={{ left: '10%', top: '20%' }}></div>
            <div className={styles.pixel} style={{ left: '50%', top: '50%' }}></div>
            <div className={styles.pixel} style={{ left: '80%', top: '30%' }}></div>
            <h1 className={styles.title}>Arcade Storage</h1>
            <p>Stored Number: {number}</p>
            <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={styles.input}
            />
            <button onClick={updateStoredNumber} className={styles.button}>Update Number</button>
        </div>
    );
}

export default App;