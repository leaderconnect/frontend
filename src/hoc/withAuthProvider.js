import { Component } from "react";

function withAuthProvider(Wrappable) {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                userData: null,
                fetching: true
            }
        }

        render() {
            const { fetching, userData } = this.state;

            if (fetching) {
                return "Loading...";
            }

            return (
                userData ? (
                    <Wrappable userData={userData} />
                ) : (
                    "Login required."
                )
            );
        }
    }
}