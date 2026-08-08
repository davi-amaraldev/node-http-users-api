export function validateCreateUser(userData) {
    if (!userData.name || !userData.email || userData.age === undefined) {
        throw new Error('Nome, email e idade são obrigatórios.');
    }

    validateUserFields(userData);
}

export function validateUserFields(userData) {
    if (userData.name !== undefined) {
        if (typeof userData.name !== 'string') {
            throw new Error('O campo NOME deve ser texto.');
        }

        if (userData.name.trim().length < 2) {
            throw new Error('O campo NOME deve ter pelo menos 2 caracteres.');
        }
    }

    if (userData.email !== undefined) {
        if (typeof userData.email !== 'string') {
            throw new Error('O campo EMAIL deve ser texto.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(userData.email)) {
            throw new Error('EMAIL inválido.');
        }
    }

    if (userData.age !== undefined) {
        if (typeof userData.age !== 'number') {
            throw new Error('O campo IDADE deve ser um número.');
        }

        if (!Number.isInteger(userData.age) || userData.age < 0) {
            throw new Error('O campo IDADE deve ser um número inteiro positivo.');
        }
    }
}

export function validateUpdateUser(userData) {
    const allowedFields = ['name', 'email', 'age'];

    const hasValidField = allowedFields.some(
        field => userData[field] !== undefined
    );

    if (!hasValidField) {
        throw new Error(
            'Informe pelo menos um campo válido: name, email ou age.'
        );
    }

    validateUserFields(userData);
}

export function validateUserID(id){
    const numericId = Number(id);

    if(!Number.isInteger(numericId) || numericId <= 0){
        throw new Error('ID deve ser um número inteiro positivo');
    }

    return numericId;
}