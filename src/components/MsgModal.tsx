type msgProps = {
    message: string,
    restart: Function
}
  
const MsgModal:React.FC<msgProps> = ({message, restart}) => (
    <div className="msg-modal">
        <h2>{message}</h2>
        <a className="btn" href="" onClick={e => {e.preventDefault(); restart()}}>Restart</a>
    </div>
)

export default MsgModal