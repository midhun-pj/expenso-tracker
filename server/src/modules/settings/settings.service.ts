import { PrismaClient } from '@prisma/client'
import { Config, DEFAULT_CURRENCY, DEFAULT_THEME } from '@models/config.model'


function mapConfigResponse(config: any): Config {
    return {
        currency: config.currency,
        themeConfig: {
            themeName: config.themeName,
            navColor: config.navColor,
            textColor: config.textColor,
            primaryColor: config.primaryColor,
            successColor: config.successColor,
        },
        id: config.id,
        userId: config.userId,
        createdAt: config.createdAt,
        updatedAt: config.updatedAt,
    }
}


export async function getConfigService(prisma: PrismaClient, userId: string) {
    const configuration = await prisma.config.findUnique({ where: { userId } })

    if (!configuration) {
        // Return sensible defaults when no config has been saved yet
        return {
            currency: DEFAULT_CURRENCY,
            themeConfig: DEFAULT_THEME,
        }
    }

    return mapConfigResponse(configuration)

}

export async function saveConfigService(
    prisma: PrismaClient,
    userId: string,
    data: Config
) {
    const { currency, themeConfig } = data


    const cfg = await prisma.config.upsert({
        where: { userId },
        create: {
            userId,
            currency,
            themeName: themeConfig.themeName,
            navColor: themeConfig.navColor,
            textColor: themeConfig.textColor,
            primaryColor: themeConfig.primaryColor,
            successColor: themeConfig.successColor,
        },
        update: {
            currency,
            themeName: themeConfig.themeName,
            navColor: themeConfig.navColor,
            textColor: themeConfig.textColor,
            primaryColor: themeConfig.primaryColor,
            successColor: themeConfig.successColor,
        },
    })

    return mapConfigResponse(cfg)
}
