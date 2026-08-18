import test from 'node:test';
import assert from 'node:assert/strict';
import {
    validateCreateUser,
    validateUpdateUser,
    validateUserID,
} from '../src/validators/user-validator.js';


test('deve aceitar um usuário válido', () => {
    const user = {
        name: 'Davi',
        email: 'davi@example.com',
        age: 18,
    };

    assert.doesNotThrow(() => {
        validateCreateUser(user);
    });
});

test('deve rejeitar email inválido', () => {
    const user = {
        name: 'Davi',
        email: 'email-invalido',
        age: 19,
    }

    assert.throws(
        () => validateCreateUser(user),
        /EMAIL inválido/
    )
});

test('deve rejeitar um usuário sem campos obrigatórios', () => {
    const user = {
        name: 'Davi',
        age: 20,
    }

    assert.throws(
        () => validateCreateUser(user),
        /Nome, email e idade são obrigatórios/
    );
});

test('deve rejeitar ID inválido', () => {
    assert.throws(
        () => validateUserID('abc'),
        /ID deve ser um número inteiro positivo/
    );
});

test('deve aceitar atualização parcial válida', () => {
    const userData = {
        name: 'Novo nome',
    }

    assert.doesNotThrow(() => {
        validateUpdateUser(userData);
    });
});

test('deve rejeitar atualização sem campos válidos', () => {
    assert.throws(
        () => validateUpdateUser({}),
        /Informe pelo menos um campo válido/
    );
});