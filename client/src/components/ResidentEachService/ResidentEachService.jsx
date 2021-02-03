import React from "react";
import DetailModal from "../DetailModal/DetailModal";
import { useHistory } from "react-router-dom";
import {NEW, 
    VIEWED, 
    INPROGRESS,
    DONE,
    ARCHIVED,
    VERIFIED, 
    statusTEXT
    } from '../../constants/status';

function ResidentEachService(props) {
  const modalId = `request-${props.id}`;
  const history = useHistory();
  const handleOnClick = async () => {
    console.log(props.id)
    await fetch(`http://localhost:3008/api/service-requests/${props.id}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": `${localStorage.getItem("token")}`,
      },
    });
    history.go(0);
  };

  const handleDate = () => {
    let dateObject = new Date(props.date);
    const canFormat = new Intl.DateTimeFormat("en-CA", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(dateObject);

    return canFormat;
  };

  return (
    <>
      <tr>
        <td>{handleDate()}</td>
        <td>{props.type}</td>
        <td>
          <button
            type="button"
            className="btn btn-dark"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
          >
            Details
          </button>
        </td>
        <td>
          <i className="fas fa-trash-alt" onClick={handleOnClick}></i>
        </td>
        <td>
          <DetailModal
            id={modalId}
            image={props.image}
            subject={props.subject}
            description={props.description}
            comments={props.comments}
            status={props.status}
          />
        </td>

        <td>{props.status ? statusTEXT[props.status] : null }</td>
      </tr>
    </>
  );
}

export default ResidentEachService;
