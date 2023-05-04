

export default function Winner(props){
   // const arr=props.arr;
    if(props.arr.length!=0){
        return(
            <ul>
                {props.arr.map((ele,id)=>{
                    return <h4 key={id} className="perti bg-secondary">{ele}</h4>
                })}
            </ul>
        )
    }
    else{
        return (
            <div> <h4 className="perti bg-secondary">-:wait for the result:-</h4></div>
        )
    }
}