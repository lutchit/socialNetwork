# API documentation

## Users

- GET /account/me

The `GET /account/me` request can be used to retrieve authentified user account.

### Header

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | User

Error Code | Description
---------- | -------------
404 | User not found.
500 | Server side error.

- GET /account/:id

The `GET /account/:id` request can be used to an user account.

### Header

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | User

Error Code | Description
---------- | -------------
404 | User not found.
500 | Server side error.

- POST /account/signup

The `GET /account/:id` request can be used to an user account.

### Header

Body parameters | Value description
---------- | -------------
email | The user email.
password | The user password.
firstname | The user firstname.
lastname | The user lastname.
*biography* | *The user biography.*

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | String | User created

Error Code | Description
---------- | -------------
404 | User not found.
500 | Server side error.
