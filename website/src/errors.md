# Errors

## 400
A 400 error is returned if the request that was sent to the server is invalid, contains illegal characters or has any other kind of formatting error. This can most of the time be resolved by starting a new request.

## 403
A 403 error is returned if you are unauthorized to view a certain page or resource. This can mostly be solved by logging in using the login page.

## 404
A 404 error is returned if the page was not found on the server. This can be either due to a wrong link or a badly configured server, but is mostly user error, so a misspelled link.

## 500
An internal server error occurs when the server is unable to properly process a request, which in some cases might also return a [400](#400) error, if the server first decides that the request is unacceptable. 