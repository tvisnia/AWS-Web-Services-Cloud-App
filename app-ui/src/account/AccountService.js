import {
    CognitoUser,
    CognitoUserPool,
    CognitoUserAttribute,
    AuthenticationDetails
} from 'amazon-cognito-identity-js';
import { CognitoIdentityCredentials } from 'aws-sdk'
import { awsConfig } from '../aws_exports';
import { UserPoolData } from "./commons/Const"

var UserPool = new CognitoUserPool(UserPoolData)

export const confirmAccount = (payload) => {
    const user = new CognitoUser({
        Username: payload.email,
        Pool: UserPool
    })
    return new Promise((resolve, reject) => {
        user.confirmRegistration(payload.code, true, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

export const register = (payload) => new Promise((resolve, reject) => {
    UserPool.signUp(payload.email, payload.password, [
        new CognitoUserAttribute({ Name: 'website', Value: payload.website })
    ], null, (err, result) => {
        if (err)
            reject(err)
        resolve(result)
    })
})

export const refreshAwsCredentials = (tokenData) => {
    AWS.config.credentials = new CognitoIdentityCredentials({
        IdentityPoolId: awsConfig.identityPoolId,
        Logins: {
            [awsConfig.credentialsLoginKey]: tokenData.getIdToken().getJwtToken()
        }
    })
}

export const loadLocalStorageCredentials = () => new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser()
    if (!user)
        reject("User not available")

    user.getSession((err, session) => {
        if (err)
            reject(`Session not available. ${err}`)
        resolve(session)
    })
})

export const login = (payload) => {
    const authDetails = new AuthenticationDetails({
        Username: payload.email,
        Password: payload.password
    })

    const user = new CognitoUser({
        Username: payload.email,
        Pool: UserPool
    })
    return new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                resolve(result)
            },
            onFailure: (err) => {
                reject(err)
                console.error(err)
            }
        })
    })
}

export const getCurrentUser = () => new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser()
    if (!user)
        reject("User not available")

    user.getSession((err, session) => {
        if (err)
            reject(err)

        user.getUserAttributes((err, attributes) => {
            if (err) reject(err)
            console.log(attributes)
            const profile = attributes.reduce((acc, item) => ({ ...acc, [item.Name]: [item.Value] }), {})
            resolve(profile)
        })
    })
})

export const getAccessToken = () => new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser()
    if (!user)
        reject("User not available")

    user.getSession((err, session) => {
        if (err)
            reject(err)

        resolve(session.getIdToken().getJwtToken());
    })
})