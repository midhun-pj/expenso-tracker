import { PrismaClient } from '@prisma/client'

interface ThemeConfig {
    themeName: string
    navColor: string
    textColor: string
    buttonColor: string
}

/** Shape that maps the DB Config row → client response */
function toResponse(cfg: {
    currency: string
    themeName: string
    navColor: string
    textColor: string
    buttonColor: string
}) {
    return {
        currency: cfg.currency,
        themeConfig: {
            themeName: cfg.themeName,
            navColor: cfg.navColor,
            textColor: cfg.textColor,
            buttonColor: cfg.buttonColor,
        } as ThemeConfig,
    }
}

export async function getConfigService(prisma: PrismaClient, userId: string) {
    const cfg = await prisma.config.findUnique({ where: { userId } })

    if (!cfg) {
        // Return sensible defaults when no config has been saved yet
        return {
            currency: '$',
            themeConfig: {
                themeName: 'ocean',
                navColor: '#ffffff',
                textColor: '#0f172a',
                buttonColor: '#10b981',
            } as ThemeConfig,
        }
    }

    return toResponse(cfg)
}

export async function saveConfigService(
    prisma: PrismaClient,
    userId: string,
    data: { currency: string; themeConfig: ThemeConfig }
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
            buttonColor: themeConfig.buttonColor,
        },
        update: {
            currency,
            themeName: themeConfig.themeName,
            navColor: themeConfig.navColor,
            textColor: themeConfig.textColor,
            buttonColor: themeConfig.buttonColor,
        },
    })

    return toResponse(cfg)
}
