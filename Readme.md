This repository purpose is to show how to use Cypress with Playwright and Mocha test frameworks for API testing and to measure the performance of these frameworks.

## Prerequisites

- [Cypress](https://www.cypress.io/)
- [Playwright](https://playwright.dev/)
- [Mocha](https://mochajs.org/)
- [Pytest](https://docs.pytest.org/en/latest/)

## Installation

JavaScript libraries can be installed with `npm`

```bash
npm install
```
Pytest can be installed with `pipenv`

```bash
pip install pipenv
pipenv shell
pipenv install
```

## Usage

For the sake of clean measurements there are no external reporters installed.

Cypress can be run from the command line.
```bash
npm run cypress
```

Playwright can be run from the command line.
```bash
npm run playwright
```

Mocha can be run from the command line.
```bash
npm run mocha
```

Pytest can be run from the command line.
```bash
pipenv run pytest
```

## Performance results

```bash
node test_time.js
```

```bash
python pytest_time.py
```

## Conclusion

Time measured per framework for one user and one contact scenario:

1. Cypress: > 37s
2. Playwright: > 16s
3. Mocha: > 14s
4. Pytest: > 5s

Time measured per framework for multiple users (11) and multiple contact (11) scenarios:

1. Cypress: > 4m29s
2. Playwright: > 39s
3. Mocha: > 1m21s
4. Pytest: > 53s

Measured performance results can be found in results folder.

I hope you find this repository useful.