// import { Request } from 'express';
// import * as uuid from 'uuid';
// import { requestByContext } from 'shared/utils';

// export function setCorrelationId(request: Request, _, next) {
//     const xCorrelationId = request.get('x-correlation-id');
//     const correlationId = xCorrelationId || uuid.v4();
//     requestByContext.setToContextRequest('correlationId', correlationId);
//     next();
// }
