1: Project Architecture (Monorepo)
2: Backend Setup (Express + MongoDB)
env config
db.ts, app.ts, server.ts, error middleware
auth

<!-- user,login, register  api and validation -->

user model
zod validation schema for login, register ,userrole(shared)
auth service login,register,refreshtokens
use service in controllers
auth routes login,refresh,register

<!-- auth middleware -->

global request interface containing user
apiError for all dynamic error and adding that to error middleware
asyncHandler (to remove try catch)
auth middleware (protect) (verifies token and sets user(userid,role) in req), added to app.ts
authorize(role based middleware)

<!-- refresh token endpoint with cookies and logout -->

logout,setRefreshTokenCookie,clearRefreshTokenCookie,clearcookie service
set refreshtoken to cookie and use that in requests
logout controller (removes refreshtoken from user, removes refreshtoken from cookie)

<!-- verify refresh token properly and implement /me endpoint -->

update refreshtokens verify jwt token, match user with decoded id, token
/me

<!-- forgot password + reset password -->

forgot password ,resettoken from crypto,expirytime then add to schema of user, created link from that sent that link with resettoken
reset password sends that resettoken, new password checks in users verifies expirytime

<!-- email verification isEmailVerified -->

add emailVerificationToken,emailVerificationExpire too user schema same process as forgot ,reset

<!-- address module -->

addressDto , createAddressSchema,updateAddressSchema in shared
IAddress Interface,addressSchema in backend (addresses: IAddress[])=> in IUser
addresses: { type: [addressSchema], default: []}, in userSchema
crud address controllers,routes
add routes to app.ts

<!-- Category Module -->

category schema with fields like slug consisting simplified name with -, level ,parent
category crud services, controller with protected routes for admin,public, paired to app.ts

🔥 Production Improvements (Next Level)
Later we’ll add:
✅ category tree endpoint /api/categories/tree
✅ caching categories in Redis
✅ soft delete (isDeleted)
✅ slug uniqueness handling for duplicates

<!-- Product Module -->

product,variant type dto, zod validation schema create,update product, productvariant
model product, variant,
services crud,controller,routes(public+admin), paired to app.ts

<!-- Cart Module -->

cart,cartItem type dto, zod validation schema add,update cart
model,apis add,update cart, delete item,clear cart
services crud,controller,routes, paired to app.ts

<!-- Checkout + Order Module -->

Pending → Paid → Processing → Shipped → Delivered
Cancelled
Later we can add return/refund.

orderDto,orderitemDto, zod validation for createorder,
schema orderitem,order

create order from cart
get my orders
get order by id
cancel order
updateorderstatusbyadmin services,controller,routes,paired to app.ts

⚠️ Note: Stock deduction should ideally be done using transactions, we’ll improve later.
