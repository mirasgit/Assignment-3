// src/components/NFTGallery.js
const ethers = require('ethers');
const { useState, useEffect } = require('react');
const Web3Modal = require('web3modal');

const MyNFTCollectionABI = require('../contracts/MyNFTCollection.json'); // ABI

const contractAddress = '0x9b81859BD49FB0aAaFAB036cd4fbe89A77429de7'; // contract address

const NFTGallery = () => {
    const [nftCount, setNFTCount] = useState(0);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(contractAddress, MyNFTCollectionABI, signer);

                    const count = await contract.balanceOf(signer.getAddress());
                    setNFTCount(count.toNumber());
                    setProvider(provider);
                    setContract(contract);
                    setAccount(await signer.getAddress());
                }
            } catch (error) {
                console.error('Error initializing:', error);
            }
        };

        init();
    }, []);

    const connectWallet = async () => {
        try {
            setLoading(true);

            const web3Modal = new Web3Modal({
                network: 'mainnet', // Adjust to the desired network
                cacheProvider: true,
            });

            const provider = await web3Modal.connect();
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const signer = ethersProvider.getSigner();
            const connectedContract = new ethers.Contract(contractAddress, MyNFTCollectionABI, signer);

            const count = await connectedContract.balanceOf(signer.getAddress());
            setNFTCount(count.toNumber());
            setProvider(ethersProvider);
            setContract(connectedContract);
            setAccount(await signer.getAddress());

            setLoading(false);
        } catch (error) {
            console.error('Error connecting wallet:', error);
            setLoading(false);
        }
    };

    const logout = () => {
        setProvider(null);
        setContract(null);
        setAccount(null);
    };

    const mintNFT = async () => {
        try {
            setLoading(true);
            const transaction = await contract.mint();
            await transaction.wait();
            setNFTCount(nftCount + 1);
        } catch (error) {
            console.error('Error minting NFT:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>NFT Gallery DApp</h1>
            {account ? (
                <div>
                    <p>Connected Account: {account}</p>
                    <p>Total NFTs: {nftCount}</p>
                    <button onClick={mintNFT} disabled={loading}>
                        {loading ? 'Minting...' : 'Mint NFT'}
                    </button>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <div>
                    <p>No wallet connected</p>
                    <button onClick={connectWallet} disabled={loading}>
                        {loading ? 'Connecting...' : 'Connect Wallet'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default NFTGallery;
