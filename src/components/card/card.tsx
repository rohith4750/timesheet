import React from "react";
import "./card.scss";

interface GraphData {
  icon: string;
  graphType: string;
  value: string | number;
  description: string;
}

interface StatItem {
  classes: string;
  value: string | number;
}

interface CardProps {
  heading: string;
  value: number | string;
  info: string;
  classes?: string;
  type?: string;
  graph?: GraphData;
  stats?: StatItem[];
}

const Card: React.FC<CardProps> = ({
  heading,
  value,
  info,
  graph,
  stats,
  classes = "",
  type = "c1",
}) => {
  const getIcon = (img: string) => {
    return require(`../../assets/images/${img}`);
  };
  return (
    <>
      {type === "c1" && (
        <div className={`c1-card ${classes}`}>
          <div className="title">
            <h3>{heading}</h3>
          </div>
          <div className="content">
            <p>{value}</p>
            <span>{info}</span>
          </div>
        </div>
      )}
      {type === "c2" && (
        <div className={`c2-card ${classes}`}>
          <div className="title">
            <h3>{heading}</h3>
          </div>
          <div className="content">
            <p>{value}</p>
          </div>
          {graph?.icon && (
            <div className="graph">
              <img src={getIcon(graph.icon)} alt="digital sample" />
              <div className={graph.graphType}>{graph.value}</div>
              <div>{graph.description}</div>
            </div>
          )}
          {stats?.length && (
            <div className="stats">
              {stats.map((st: StatItem, i: number) => (
                <div key={i} className={st.classes}>
                  {st.value}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {type === "c3" && (
        <div className={`c3-card ${classes}`}>
          <div className="title">
            <h3>{heading}</h3>
          </div>
          <div className="content">
            <p>{value}</p>
          </div>
          {graph?.icon && (
            <div className="graph">
              <img src={getIcon(graph.icon)} alt="digital sample" />
              <div className={graph.graphType}>{graph.value}</div>
              <div>{graph.description}</div>
            </div>
          )}
          {stats?.length && (
            <div className="stats">
              {stats.map((st: StatItem, i: number) => (
                <div key={i} className={st.classes}>
                  {st.value}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {type === "c4" && (
        <div className={`c4-card ${classes}`}>
          <div className="title">
            <h3>{heading}</h3>
          </div>
          <div className="content">
            <p>{value}</p>
          </div>
          <span>{info}</span>
        </div>
      )}
    </>
  );
};

export default Card;
