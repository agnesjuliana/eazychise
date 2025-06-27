# EazyChise

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. **Copy the `.env.example` to `.env`:**

```bash

copy .env.example .env

```

2. Fill in the environment variables in `.env`, `.env.example` is set default as Dev Environment.

3. **Installing dependencies:**

```bash

npm install

```

6. **Build and start containers with Docker Compose:**

```bash

docker-compose up -d --build

```

4. **Migrate database schema:**

```bash

npm run prisma:migrate

```

5. Init Prisma GUI (Optional):

```bash

npm run prisma:studio

```

7. **Start the application in development:**

```bash

npm run dev

```

Open [http://localhost:3000](http://localhost:3000/) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page will automatically update as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) — your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out [Vercel Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
