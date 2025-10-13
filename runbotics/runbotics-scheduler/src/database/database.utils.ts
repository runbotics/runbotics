import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export interface TypedTransformer<TEntity, TDatabase> {
    from: (entityValue: TEntity) => TDatabase;
    to: (databaseValue: TDatabase) => TEntity;
}

export const dateTransformer: TypedTransformer<Date | string, string> = {
    from: (value: Date | string) => {
        if (!value) return null;

        return typeof value === 'string'
            ? value
            : dayjs(value).utcOffset(0, true).toISOString();
    },
    to: (value: string) => value,
} as const;

export const numberTransformer: TypedTransformer<string | number, number> = {
    to: (data: number): number => data,
    from: (data: string | number): number => Number(data),
};

const productionEnvs = ['Runbotics-QAS', 'Runbotics-DEV', 'Runbotics-PROD'];
const isProductionEnv = productionEnvs.includes(process.env.RUNBOTICS_ENVIRONMENT);

export const getMigrations = () => {
    if (isProductionEnv) {
        return [
            'dist/src/migrations/*.js',
        ];
    }
    else {
        return [
            'dist/src/migrations/*.js',
            'dist/src/migrations/local/*.js',
        ];
    }
};
