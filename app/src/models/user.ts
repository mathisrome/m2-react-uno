export default class User {
    id: string | null;
    firstname: string
    lastname: string
    username: string
    email: string
    password: string

    constructor(
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        id: string | null = null
    ) {
        this.firstname = firstName;
        this.lastname = lastName;
        this.username = username;
        this.email = email;
        this.password = password
        this.id = id
    }
}