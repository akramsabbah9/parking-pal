import React, { useState } from "react";
import "./style.scss";
import { useMutation } from "@apollo/react-hooks";
import { todaysDate, utcDate } from "../../utils/helpers";
import { QUERY_ALL_PARKING, QUERY_USER } from "../../utils/queries";
import { ADD_INVENTORY } from "../../utils/mutations";

const NewInventory = ({ parkingId, inventory, setInventory }) => {
    const [formState, setFormState] = useState({ date: "", price: 1 });
    const [formError, setFormError] = useState("");
    const [addInventory, { error }] = useMutation(ADD_INVENTORY, {
        refetchQueries: [ { query: QUERY_USER }, { query: QUERY_ALL_PARKING } ]
    });

    const handleChange = event => {
        // destructure event target
        const { name, value } = event.target;

        // if event name is date, reset formError
        if (name === "date") setFormError("");

        // update state
        setFormState({ ...formState, [name]: value });
    }

    // when the form is reset, force a change event on inputs to reset them.
    const handleReset = event => {
        event.preventDefault();
        const changeEvent = new Event("change");

        // setup element query selectors
        let formDate = document.querySelector("#date");
        let formPrice = document.querySelector("#price");

        // reset elements and dispatch change event manually
        formDate.value = "";
        formDate.dispatchEvent(changeEvent);

        formPrice.value = 1;
        formPrice.dispatchEvent(changeEvent);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        // validate: if date is empty, set error message and return
        // check price here in case user edited the html maliciously
        if (formState.date.length === 0 || formState.price <= 0) {
            // console.log("error");
            setFormError("Please choose a date!");
            return;
        }

        // console.log(parkingId, formState);

        try {
            const { data : { addInventory: newInv } } = await addInventory({
                variables: {
                    startDate: utcDate(formState.date),
                    price: parseFloat(formState.price),
                    parkingPlace: parkingId
                }
            });
            // console.log(newInv.startDate)

            setInventory({
                ...inventory,
                invList: [...inventory.invList, {
                    _id: newInv._id,
                    startDate: newInv.startDate,
                    price: newInv.price,
                    isAvailable: newInv.isAvailable
                }]
            });

            // clear form after submission
            event.target.reset();
            setFormState({ date: "", price: 1 });

        }
        catch (e) {
            console.error(e);

            if (error) console.error(error);
        }
    };

    return (<>
        <h2>Add a New Availability</h2>
        <form className="add-inventory-form" onSubmit={handleSubmit} onReset={handleReset}>
            <div className="field inv-field">
                <label htmlFor="date">Date</label>
                <input
                    name="date"
                    id="date"
                    type="date"
                    min={todaysDate(1)} // can't reserve space for current day
                    onChange={handleChange}
                />
            </div>
            <div className="field inv-field">
                <label htmlFor="price">Price </label>
                <input
                    placeholder="1.00"
                    name="price"
                    id="price"
                    type="number"
                    step="any"
                    min="1" // min="1.00"
                    defaultValue="1"
                    // step="0.01" // database typeDefs use Int for now
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Add New Availability</button>
        </form>
        {formError && <p className="required-field">Error: {formError}</p>}
    </>);
};

export default NewInventory;
