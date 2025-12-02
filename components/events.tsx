/*
const ContractEventsView = ({contract, web3}:{contract : Contract<any>, web3 : Web3})=> {
  const [contractEvents , setContractEvents] = React.useState<EventLog[]>([])
  const getContractEvents = async  ()=> {
    try {
      const latestBlock = await web3.eth.getBlockNumber();
      console.log({latestBlock})
      const events = await contract.getPastEvents("allEvents", {
      fromBlock: Number(latestBlock) - 2500,
      toBlock: "latest"
      });
      console.log({events})
      setContractEvents(events.filter((e)=> typeof e !== "string"))
    } catch (error) {
     const err = (error as any)?.message || String(error);
      toast.error("Failed to fetch contract data", { description: err });
      
    }
    
  }

  React.useEffect(()=> {
    getContractEvents()
  }, [contract,web3])

  return <div className="flex w-full justify-center flex-wrap ">
    {
      contractEvents.slice(0, 100).map((e, index)=> {
        const event = e.returnValues

        return <Card key={index} >
          <CardHeader>
           <CardTitle>
            {e.event}
          </CardTitle>


          </CardHeader>
         
        </Card>
      })
    }

  </div>
}*/
