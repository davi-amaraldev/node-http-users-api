import { ValidationError } from '../errors/validation-error.js';

export function validateCreateUser(userData) {
    if (!userData.name || !userData.email || userData.age === undefined) {
        throw new ValidationError('Nome, email e idade são obrigatórios.');
    }

    validateUserFields(userData);
}

export function validateUserFields(userData) {
    if (userData.name !== undefined) {
        if (typeof userData.name !== 'string') {
            throw new ValidationError('O campo NOME deve ser texto.');
        }

        if (userData.name.trim().length < 2) {
            throw new ValidationError('O campo NOME deve ter pelo menos 2 caracteres.');
        }
    }

    if (userData.email !== undefined) {
        if (typeof userData.email !== 'string') {
            throw new ValidationError('O campo EMAIL deve ser texto.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(userData.email)) {
            throw new ValidationError('EMAIL inválido.');
        }
    }

    if (userData.age !== undefined) {
        if (typeof userData.age !== 'number') {
            throw new ValidationError('O campo IDADE deve ser um número.');
        }

        if (!Number.isInteger(userData.age) || userData.age < 0) {
            throw new ValidationError('O campo IDADE deve ser um número inteiro positivo.');
        }
    }
}

export function validateUpdateUser(userData) {
    const allowedFields = ['name', 'email', 'age'];

    const hasValidField = allowedFields.some(
        field => userData[field] !== undefined
    );

    if (!hasValidField) {
        throw new ValidationError(
            'Informe pelo menos um campo válido: name, email ou age.'
        );
    }

    validateUserFields(userData);
}

export function validateUserID(id){
    const numericId = Number(id);

    if(!Number.isInteger(numericId) || numericId <= 0){
        throw new ValidationError('ID deve ser um número inteiro positivo');
    }

    return numericId;
}