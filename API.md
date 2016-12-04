# API documentation

## Users

- GET /api/account/me

The `GET /api/account/me` request can be used to retrieve authentified user account.

### Parameters

#### Headers

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

- GET /api/account/:id

The `GET /api/account/:id` request can be used to an user account.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
id | The user id.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | User

Error Code | Description
---------- | -------------
404 | User not found.
500 | Server side error.

- POST /api/account/signup

The `POST /api/account/signup` request can be used to create an user.

### Parameters

#### Body

Key | Value description
---------- | -------------
email | The user email.
password | The user password.
firstname | The user firstname.
lastname | The user lastname.
*biography* | *The user biography.*

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | User, Token

Error Code | Description
---------- | -------------
401 | Missing required fields.
409 | Email already used.
500 | Server side error.

- POST /api/account/authenticate

The `POST /api/account/authenticate` request can be used to authentify yourself.

### Parameters

#### Body

Key | Value description
---------- | -------------
email | The user email.
password | The user password.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | Token

Error Code | Description
---------- | -------------
401 | Missing required fields or authentication impossible.
404 | User related to the given email not found.
500 | Server side error.

- PUT /api/account/:id

The `PUT /api/account/:id` request can be used to update an user.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
id | The user id.

#### Body

Key | Value description
---------- | -------------
*firstname* | *The user firstname.*
*lastname* | *The user lastname.*
*biography* | *The user biography.*

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | User

Error Code | Description
---------- | -------------
404 | User related to the given id not found.
500 | Server side error.

- DELETE /api/account/:id

The `DELETE /api/account/:id` request can be used to remove an user.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
id | The user id.

Response Code | Content-type | Content
---------- | ------------- | -------------
204 | |

Error Code | Description
---------- | -------------
404 | User related to the given id not found.
500 | Server side error.

## Groups

- GET /api/groups/:id

The `GET /api/groups/:id` request can be used to retrieve a group.

### Parameters

#### Request

Key | Value description
---------- | -------------
id | The user id.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | Group

Error Code | Description
---------- | -------------
404 | Group related to the given id not found.
500 | Server side error.

- GET /api/groups

The `GET /api/groups` request can be used to retrieve all groups with a formatted form.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | [Groups]

Error Code | Description
---------- | -------------
500 | Server side error.

- GET /api/groups

The `GET /api/groupsDetailed` request can be used to retrieve all groups in details.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | [Groups]

Error Code | Description
---------- | -------------
500 | Server side error.

- DELETE /api/groups/:id

The `DELETE /api/groups/:id` request can be used to remove a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
id | The group id.

Response Code | Content-type | Content
---------- | ------------- | -------------
204 | |

Error Code | Description
---------- | -------------
403 | User identified using the token doesn't have the right to do that.
404 | Group related to the given id not found.
500 | Server side error.

- POST /api/groups/create

The `POST /api/groups/create` request can be used to create a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Body

Key | Value description
---------- | -------------
name | The group name.
idAdmin | The admin id.
*description* | *The group description.*

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | Group

Error Code | Description
---------- | -------------
401 | Missing required fields.
404 | User who wants to create the group doesn't found.
500 | Server side error.

- PUT /api/groups/:id

The `PUT /api/groups/:id` request can be used to update a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
id | The group id.

#### Body

Key | Value description
---------- | -------------
*name* | *The group name.*
*description* | *The group description.*

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | Group

Error Code | Description
---------- | -------------
403 | User who whants to update the group hasn't the rights to do that.
404 | Group related to the given id not found.
500 | Server side error.

- PUT /api/groups/join/:groupId

The `PUT /api/groups/join/:groupId` request can be used to join a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
groupId | The group id.

#### Body

Key | Value description
---------- | -------------
userId | The user id.

Response Code | Content-type | Content
---------- | ------------- | -------------
204 |  | 

Error Code | Description
---------- | -------------
403 | An user tries to add an other user to the group.
404 | User or group related to the given ids not found.
409 | User already in the group.
500 | Server side error.

- GET /api/groups/:id/admin

The `GET /api/groups/:id/admin` request can be used to get admin of a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
id | The group id.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | User

Error Code | Description
---------- | -------------
404 | Group related to the given id not found.
500 | Server side error.

- DELETE /api/groups/:groupId/members/:userId

The `DELETE /api/groups/:groupId/members/:userId` request can be used to remove an user from a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
groupId | The group id.
userId | The user id.

Response Code | Content-type | Content
---------- | ------------- | -------------
204 | |

Error Code | Description
---------- | -------------
403 | Admin cannot be removed or an user tries to remove an other user.
404 | Group or user related to the given ids not found.
500 | Server side error.

- GET /api/groups/members/:userId

The `GET /api/groups/members/:userId` request can be used to retrieve all group a user is a member of.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
userId | The user id.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | [Groups]

Error Code | Description
---------- | -------------
404 | User related to the given id not found.
500 | Server side error.

- POST /api/groups/:groupId/comments/create

The `POST /api/groups/:groupId/comments/create` request can be used to add a comment on a group dashboard.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
groupId | The group id.

#### Body

Key | Value description
---------- | -------------
authorId | The author id.
message | The comment.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | Comment

Error Code | Description
---------- | -------------
401 | Missing required fields.
403 | An user not in the group tries to add a comment.
404 | User who wants to add the comment not found or Group not found.
500 | Server side error.

- GET /api/groups/:groupId/comments

The `GET /api/groups/:groupId/comments` request can be used to retrieve all comments for a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
groupId | The group id.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | [Comments]

Error Code | Description
---------- | -------------
403 | An user not in the group tries to retrieve all comments.
404 | Group related to the given id not found.
500 | Server side error.

- GET /api/groups/:groupId/comments/:commentId

The `GET /api/groups/:groupId/comments/:commentId` request can be used to retrieve a comment for a group.

### Parameters

#### Headers

Key | Value description
---------- | -------------
x-access-token | The token allowing to justify you're authentified.

#### Request

Key | Value description
---------- | -------------
groupId | The group id.
commentId | The comment id.

Response Code | Content-type | Content
---------- | ------------- | -------------
200 | JSON | Comment

Error Code | Description
---------- | -------------
403 | An user not in the group tries to retrieve a comment.
404 | Group or comment related to the given ids not found.
500 | Server side error.