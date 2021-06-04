import { awsConfig } from '../../aws_exports'

export const RegisterRequestPayload = {
    email: 'tomek97@gmail.com',
    password: 'Hasło123',
    website: 'jkan.pl'
}

export const ConfirmAccountRequestPauload = {
    code: '662808',
    email: RegisterRequestPayload.email
}

export const LoginRequestPayload = {
    email: RegisterRequestPayload.email,
    password: RegisterRequestPayload.password
}

export const UserPoolData = {
    UserPoolId: awsConfig.userPoolId,
    ClientId: awsConfig.clientId
}