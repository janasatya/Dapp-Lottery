export default function Perticipant(props){
    if(props.man.length==0){
        return(
            <h4 className="bg-success perti">-:Wait for the pericipants:-</h4>
        )
    }
    else{
        return (
            <ul>
                {props.man.map((ele,id)=>{
                    return <h4 key={id} className="perti bg-secondary">{ele}</h4>
                })}
            </ul>
        )
    }
}