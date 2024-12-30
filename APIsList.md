# DevTinder APIs

### authRouter
- POST/signup
- POST/login
- POST/logout

### profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

### connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

### userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the profiles of other users on platform.

### Query params: 
- /user/feed?page=1&limit=10 => skip(0) limit(10)
- /user/feed?page=2&limit=10 => skip(10) limit(10)
- /user/feed?page=3&limit=10 => skip(20) limit(10)

Status - requested, ignored, accepted, rejected.
