type cellProps = {
    isSeen: boolean,
    isMatch: boolean,
    char: string,
    validate: boolean
  }

const Cell: React.FC<cellProps> = ({isSeen, isMatch, char, validate}) => {
    let classList = ["cell"];
  
    if (validate) {
      isSeen && classList.push("seen");
      isMatch && classList.push("match");
      char !== "" && classList.push("animate");
    }
  
    return <div className={classList.join(" ")}>{char}</div>
  }

export default Cell