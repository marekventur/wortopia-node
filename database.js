module.exports = {
    "test": "postgres://wortopia:wortopia@localhost/wortopia_test",
    "dev": "postgres://wortopia:wortopia@localhost/wortopia",
    "production": "postgres://" + (process.env.POSTGRES_USER || 'wortopia') + ":" + (process.env.POSTGRES_PASSWORD || 'wortopia') + "@" + (process.env.POSTGRES_HOST || 'localhost') + ":" + (process.env.POSTGRES_PORT || '5432') + "/" + (process.env.POSTGRES_DATABASE || 'wortopia'),
    "docker": "postgres://" + (process.env.POSTGRES_USER || 'wortopia') + ":" + (process.env.POSTGRES_PASSWORD || 'wortopia') + "@" + (process.env.POSTGRES_PORT_5432_TCP_ADDR || 'localhost') + ":" + (process.env.POSTGRES_PORT_5432_TCP_PORT || '5432') + "/" + (process.env.POSTGRES_DATABASE || 'wortopia')
}