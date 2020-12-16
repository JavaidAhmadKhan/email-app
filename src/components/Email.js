import React from "react";
import "./css/Email.css";

const Email = ({
  name,
  email,
  subject,
  shortDesc,
  date,
  id,
  onClick,
  read,
  markfav,
  currentCard,
}) => {
  return (
    <div>
      <div
        className={
          read.includes(parseInt(id - 1))
            ? currentCard === parseInt(id - 1)
              ? "outline card"
              : "nooutline card"
            : "noutline card"
            ? "noutline cardnocolor"
            : ""
        }
        style={{
          display: "flex",
          flexDirection: "row",
          borderSpacing: "10px",
          cursor: "Pointer",
        }}
        onClick={() => onClick(id)}
      >
        <div>
          <div
            className="avatar"
            style={{
              paddingLeft: "0.49em",
              paddingTop: "0.22em",
              fontSize: "1.8em",
              margin: "5px",
            }}
          >
            {name[0]}
          </div>
        </div>
        <div style={{ marginRight: "1vw" }}>
          <h4>
            <span>From:</span> {name} &lt;{email}&gt;
          </h4>
          <p className="subject">
            <span>Subject:</span> {subject}{" "}
          </p>
          <p>{shortDesc}</p>
          <p>
            {date}
            {markfav.includes(parseInt(id - 1)) ? (
              <button style={{ color: "#e54065" }}> Favourite</button>
            ) : (
              <button></button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Email;
