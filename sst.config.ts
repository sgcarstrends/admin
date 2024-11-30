/// <reference path="./.sst/platform/config.d.ts" />

type Stage = "dev" | "staging" | "prod";
type Domain = {
  [stage in Stage]: { name: string };
};

const DOMAIN_NAME = "admin.sgcarstrends.com";

const DOMAIN: Domain = {
  dev: { name: `dev.${DOMAIN_NAME}` },
  staging: { name: `staging.${DOMAIN_NAME}` },
  prod: { name: DOMAIN_NAME },
};

export default $config({
  app(input) {
    return {
      name: "sgcarstrends-admin",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "ap-southeast-1" },
        cloudflare: true,
      },
    };
  },
  async run() {
    const UPSTASH_REDIS_REST_URL = new sst.Secret(
      "UpstashRedisRestUrl",
      process.env.UPSTASH_REDIS_REST_URL,
    );
    const UPSTASH_REDIS_REST_TOKEN = new sst.Secret(
      "UpstashRedisRestToken",
      process.env.UPSTASH_REDIS_REST_TOKEN,
    );

    new sst.aws.Nextjs("admin", {
      link: [UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN],
      domain: {
        ...DOMAIN[$app.stage],
        dns: sst.cloudflare.dns(),
      },
      environment: {
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
      },
      server: {
        architecture: "arm64",
      },
    });
  },
});
