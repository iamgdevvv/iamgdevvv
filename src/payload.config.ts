import path from 'path'
import { buildConfig, type Field, type PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'

import { revalidateChangeStatic, revalidateDeleteStatic } from '$payload-libs/hooks/revalidate'
import { richTextEditor } from '$payload-libs/richtext'
import { getSiteGlobal } from '$payload-libs/server/repos'

import { ProfileConfig } from '$payload-global/Profile'
import { SiteConfig } from '$payload-global/Site'

import { formFields } from '$payload-fields/forms'
import { seoField } from '$payload-fields/seo'

import { Pages } from '$payload-collections/Pages'
import { Portofolios } from '$payload-collections/Portofolio'
import { PostCategories } from '$payload-collections/PostCategories'
import { Posts } from '$payload-collections/Posts'
import { Asset } from '$payload-collections/statics/Asset'
import { Certifications } from '$payload-collections/statics/Certification'
import { Experiences } from '$payload-collections/statics/Experience'
import { Reusables } from '$payload-collections/statics/Reusables'
import { Tools } from '$payload-collections/statics/Tool'
import { Users } from '$payload-collections/statics/Users'

import { ActionsBlock } from '$payload-blocks/Actions'
import { BaseContentBlock } from '$payload-blocks/BaseContent'
import { ButtonBlock } from '$payload-blocks/Button'
import { CardFormBlock } from '$payload-blocks/CardForm'
import { CollapsibleTabBlock } from '$payload-blocks/CollapsibleTab'
import { ContentMediaBlock } from '$payload-blocks/ContentMedia'
import { DividerBlock } from '$payload-blocks/Divider'
import { GalleryBlock } from '$payload-blocks/Gallery'
import { HeadingCertificationBlock } from '$payload-blocks/HeadingCertification'
import { HeadingContentBlock } from '$payload-blocks/HeadingContent'
import { HeadingExperienceBlock } from '$payload-blocks/HeadingExperience'
import { HeadingPortofolioBlock } from '$payload-blocks/HeadingPortofolio'
import { HeadingPostBlock } from '$payload-blocks/HeadingPost'
import { HeadingToolBlock } from '$payload-blocks/HeadingTool'
import { ListingCertificationBlock } from '$payload-blocks/ListingCertification'
import { ListingExperienceBlock } from '$payload-blocks/ListingExperience'
import { ListingPortofolioBlock } from '$payload-blocks/ListingPortofolio'
import { ListingPostBlock } from '$payload-blocks/ListingPost'
import { ListingPostCategoryBlock } from '$payload-blocks/ListingPostCategories'
import { ListingToolBlock } from '$payload-blocks/ListingTool'
import { MediaBlock } from '$payload-blocks/Media'
import { ProfileShowcaseBlock } from '$payload-blocks/ProfileShowcase'
import { ShowReusableBlock } from '$payload-blocks/Reusable'
import { SpacingBlock } from '$payload-blocks/Spacing'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	indexSortableFields: false,
	admin: {
		theme: 'light',
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		livePreview: {
			breakpoints: [
				{
					label: 'Mobile',
					name: 'mobile',
					width: 375,
					height: 667,
				},
				{
					label: 'Tablet',
					name: 'tablet',
					width: 768,
					height: 1024,
				},
				{
					label: 'Desktop',
					name: 'desktop',
					width: 1440,
					height: 768,
				},
			],
		},
	},
	debug: process.env.NODE_ENV === 'development',
	defaultDepth: 5,
	collections: [
		Asset,
		Pages,
		Posts,
		PostCategories,
		Portofolios,
		Certifications,
		Experiences,
		Tools,
		Reusables,
		Users,
	],
	cors: [process.env.NEXT_PUBLIC_SITE_URL],
	globals: [ProfileConfig, SiteConfig],
	editor: richTextEditor(),
	blocks: [
		ButtonBlock,
		MediaBlock,
		GalleryBlock,
		SpacingBlock,
		DividerBlock,
		CardFormBlock,
		ActionsBlock,
		BaseContentBlock,
		ContentMediaBlock,
		CardFormBlock,
		CollapsibleTabBlock,
		ProfileShowcaseBlock,
		ShowReusableBlock,
		ListingCertificationBlock,
		ListingExperienceBlock,
		ListingPortofolioBlock,
		ListingPostBlock,
		ListingPostCategoryBlock,
		ListingToolBlock,
		HeadingContentBlock,
		HeadingCertificationBlock,
		HeadingExperienceBlock,
		HeadingPortofolioBlock,
		HeadingToolBlock,
		HeadingPostBlock,
	],
	secret: process.env.PAYLOAD_SECRET,
	typescript: {
		outputFile: path.resolve(dirname, 'payload-types.ts'),
	},
	graphQL: {
		disable: true,
	},
	db: postgresAdapter({
		blocksAsJSON: true,
		pool: {
			connectionString: process.env.DATABASE_URI,
			ssl: {
				rejectUnauthorized: false,
			},
		},
	}),
	sharp,
	email: nodemailerAdapter({
		defaultFromAddress: 'example@portopro.com',
		defaultFromName: 'Example Portopro',
		transportOptions: {
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === 'true',
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		},
	}),
	plugins: [
		payloadCloudPlugin(),
		seoPlugin({
			collections: ['pages', 'posts', 'postCategories', 'portofolios'],
			uploadsCollection: 'asset',
			tabbedUI: true,
			fields: (args) => {
				const seoFields: Field[] = []

				args.defaultFields.forEach((field) => {
					if ('name' in field && field.name === 'preview') {
						seoField.forEach((seoField) => {
							seoFields.push(seoField)
						})
					} else {
						seoFields.push(field)
					}
				})

				return seoFields
			},
			generateTitle: async ({ doc }) => {
				const siteConfig = await getSiteGlobal()
				return doc?.title + (siteConfig?.title ? ` – ${siteConfig.title}` : '')
			},
			generateDescription: ({ doc }) => doc?.excerpt || '',
		}),
		formBuilderPlugin({
			redirectRelationships: ['pages'],
			formOverrides: {
				fields: ({ defaultFields }) => formFields({ defaultFields }),
				admin: {
					group: 'Form',
				},
				hooks: {
					afterChange: [revalidateChangeStatic],
					afterDelete: [revalidateDeleteStatic],
				},
			},
			formSubmissionOverrides: {
				admin: {
					group: 'Form',
				},
			},
		}),
		s3Storage({
			collections: {
				asset: {
					prefix: 'asset',
				},
			},
			bucket: process.env.SUPABASE_S3_BUCKET,
			config: {
				forcePathStyle: true,
				credentials: {
					accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
					secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
				},
				region: process.env.SUPABASE_S3_REGION,
				endpoint: process.env.SUPABASE_S3_ENDPOINT,
			},
		}),
	],
	jobs: {
		access: {
			run: ({ req }: { req: PayloadRequest }): boolean => {
				if (req.user) return true

				const authHeader = req.headers.get('authorization')
				return authHeader === `Bearer ${process.env.CRON_SECRET}`
			},
		},
		tasks: [],
	},
})
