import "./App.css";
import Winner from "./components/winner";
import State from "./components/state";
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import artifact from "./contracts/Lottery.json";
import Perticipant from "./components/perticipant";

function App() {
  const [lottery,setLottery]=useState(null);
  const [webApi, setWebApi] = useState({
    web3: null,
    provider: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, seteBalance] = useState(null);
  const [noTicket, setNoTicket] = useState(null);
  const [pericipant, setPerticipants] = useState([]);
  const [reload, setReload] = useState(false);
  const [winner, setWinner] = useState([]);

  const autoReload = () => setReload(!reload);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({
          method: "eth_requestAccounts",
        });
      } else {
        console.log("error");
      }
      const web3 = await new Web3(provider);
      const abi = artifact.abi;
      const netId = await web3.eth.net.getId();
      const add = artifact.networks[netId].address;
      const contract = await new web3.eth.Contract(abi, add);
      // console.log(contract);
      setWebApi({ web3, provider, contract });
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const loadAccounts = async () => {
      const { web3,contract } = webApi;
      const acc = await web3.eth.getAccounts();
      setAccount(acc[0]);
      const lot=await contract.methods.lotteryId().call();
      setLottery(lot);
    };
    webApi.web3 && loadAccounts();
  }, [webApi.web3, reload]);

  useEffect(() => {
    const loadBalance = async () => {
      const { web3 } = webApi;
      const bal = await web3.eth.getBalance(account);
      seteBalance(await web3.utils.fromWei(bal, "ether"));
    };
    account && loadBalance();
  }, [account, reload]);

  useEffect(() => {
    const perti = async () => {
      const { web3, contract } = webApi;
      const count = await contract.methods.count().call();
      let per = [];
      for (let i = 0; i < count; i++) {
        const add = await contract.methods.perticipants(i).call();
        per.push(add);
      }
      //  console.log(per);
      setPerticipants(per);
    };
    webApi.web3 && perti();
  }, [webApi.web3,reload]);

  const buyTicket = async () => {
    const { web3, contract } = webApi;
    const count = await contract.methods.count().call();
    await contract.methods
      .buy()
      .send({ from: account, value: await web3.utils.toWei("1", "ether") });
    const c = await contract.methods.count().call();
    setNoTicket(10 - c);
    if (count == 9) {
      const first = await contract.methods.first().call();
      let ar = [first];
      setWinner(ar);
    } else {
      setWinner([]);
    }
    autoReload();
  };

  return (
    <>
      <div className="container bg-info-subtle mb-3">
        <div className="row g-2">
          <div className="col-md">
            <div className="form-floating">
              <h4 className="bg-danger p-3 rounded-3">Account: {account}</h4>
            </div>
          </div>
          <div className="col-md">
            <div className="form-floating">
              <h4 className="bg-danger p-3 rounded-3">
                Lottery Id: {lottery}
                <br />
                Balance: {balance} ETH

              </h4>
            </div>
          </div>
        </div>
        <div className="row g-2">
          <div className="col-md">
            <div className="form-floating">
              <h4 className="bg-info p-3 rounded-3 text-center wid ">
                Number of Ticket Available: {noTicket}
              </h4>
            </div>
            <button
              type="button"
              className="btn btn-dark p-3 pe-5"
              onClick={buyTicket}
            >
              Buy
            </button>
          </div>
        </div>

        {/* pericipants */}

        <div className="form-floating bg-success-subtle p-3 rounded-3 text-center height1">
          <h4 className="bg-success perti">-:All the pericipants:-</h4>
          <Perticipant man={pericipant} />
        </div>
        {/* end */}

        {/* current result */}
      </div>
      <div className="container bg-info-subtle mb-3">
        <div className="form-floating bg-success-subtle p-3 rounded-3 text-center height1">
          <h4 className="bg-success perti">-:The Winners:-</h4>

          <Winner  arr={winner} />
        </div>
        <State arr={winner} />

        {/* end */}
      </div>
    </>
  );
}

export default App;
