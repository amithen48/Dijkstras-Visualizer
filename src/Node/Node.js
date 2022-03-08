import "./Node.css";

const Node = (props) => {
  const extra_class_name = props.isStart
    ? "node-start"
    : props.isFinish
    ? "node-finish"
    : props.isWall
    ? "node-wall"
    : "";

  return (
    <div
      id={`node-${props.row}-${props.col}`}
      className={`node ${props.className} ${extra_class_name}`}
      onClick={() => props.onClick(props)}
    ></div>
  );
};

export default Node;
