const winston = require('winston');

const logger = winston.createLogger({
    level: 'debug', // Set the minimum logging level
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json() // This will be used by default for files
    ),
    transports: [
        // Console uses a different format (cli + color)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.cli()
            )
        }),
        // File transports use JSON format (inherited from logger.format)
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

function processOrder(orderId, items) {
    logger.info(`Processing order with ID: ${orderId}`);
    logger.info(`Order details: ${JSON.stringify(items)}`);
    let total = 0;
    for (const item of items) {
        total += item.price * item.quantity;
        if (item.quantity > 10) {
            logger.warn(`Large quantity detected for item: ${item.name}`);
        }
        if (item.price <= 0) {
            logger.error(`Invalid price found for item: ${item.name}`);
        }
    }
    logger.info(`Order ${orderId} processed. Total: $${total.toFixed(2)}`);
    return total;
}

try {
    const order1 = { id: 123, items: [{ name: 'Laptop', price: 1200, quantity: 1 }, { name: 'Mouse', price: 25, quantity: 2 }] };
    processOrder(order1.id, order1.items);

    const order2 = { id: 456, items: [{ name: 'Keyboard', price: 75, quantity: 15 }, { name: 'Monitor', price: 300, quantity: 1 }, { name: 'Broken Item', price: 0, quantity: 1 }] };
    processOrder(order2.id, order2.items);

    throw new Error('Simulating a critical error');

} catch (error) {
    logger.error(`An error occurred: ${error.message}`, { stack: error.stack });
}

logger.debug('This is a debug message for development.');
