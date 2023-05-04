
export default function State(props){
    if(props.arr.length!=0){
        let add=props.add;
        for(let i=0;i<3;i++){
            if(add==props.arr[i]){
                return(
                    <div>
                        <h4  className="perti d-block bg-success text-center">You are the winner of number{i+1}</h4>
                    </div>
                )
            }
        }
        return(
            <div>
                <h4 className="perti bg-secondary ">Better luck for next time</h4>
            </div>
        )
       
    }
}