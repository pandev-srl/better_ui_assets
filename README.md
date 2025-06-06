# Better UI Assets - NPM Package Publishing Guide

This repository contains the compiled JavaScript assets for the Better UI library, published as `@pandev-srl/better-ui` on NPM.

## Prerequisites

- Node.js and npm installed
- Yarn package manager
- Access to publish to `@pandev-srl` organization on NPM
- [direnv](https://direnv.net/) installed for environment management

## Initial Setup

### 1. Install direnv

**macOS (using Homebrew):**

```bash
brew install direnv
```

**Ubuntu/Debian:**

```bash
sudo apt install direnv
```

### 2. Configure your shell

Add the following to your shell configuration file (`.bashrc`, `.zshrc`, etc.):

```bash
eval "$(direnv hook bash)"  # for bash
# or
eval "$(direnv hook zsh)"   # for zsh
```

### 3. Setup NPM Token

1. Login to [npmjs.com](https://www.npmjs.com/)
2. Go to **Access Tokens** in your account settings
3. Generate a new **Automation** token (or **Publish** token)
4. Copy the generated token

### 4. Configure Environment

1. Copy the environment example file:

```bash
cp .envrc.example .envrc
```

2. Edit `.envrc` and replace `my-token` with your actual NPM token:

```bash
export NPM_TOKEN="npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

3. Allow direnv to load the environment:

```bash
direnv allow
```

## Publishing Process

### Step 1: Version Bump

Update the version in `package.json`. Follow [Semantic Versioning](https://semver.org/):

- **Patch** (bug fixes): `0.1.0` → `0.1.1`
- **Minor** (new features): `0.1.0` → `0.2.0`
- **Major** (breaking changes): `0.1.0` → `1.0.0`

```bash
# Edit package.json manually, or use npm version command:
npm version patch    # for patch version bump
npm version minor    # for minor version bump
npm version major    # for major version bump
```

### Step 2: Build Assets

Compile the assets using Vite:

```bash
yarn build
```

This will generate the compiled files in the `dist/` directory:

- `dist/better_ui.js` (ES module)
- `dist/better_ui.umd.cjs` (UMD/CommonJS)

### Step 3: Publish to NPM

Ensure you're in the `better_ui_assets` directory and publish:

```bash
npm publish
```

The package will be published with public access due to the `publishConfig` setting in `package.json`.

## Complete Publishing Workflow

Here's the complete workflow in one go:

```bash
# 1. Ensure environment is loaded
direnv reload

# 2. Verify NPM authentication
npm whoami

# 3. Update version (choose one)
npm version patch  # or minor/major

# 4. Build assets
yarn build

# 5. Publish
npm publish

# 6. Verify publication
npm info @pandev-srl/better-ui
```

## Package Information

- **Package Name**: `@pandev-srl/better-ui`
- **Current Version**: `0.1.0`
- **Registry**: [npmjs.com](https://www.npmjs.com/package/@pandev-srl/better-ui)
- **Access**: Public
- **License**: MIT

## Files Included in Publication

The following files are included when publishing:

- `package.json` - Package metadata and dependencies
- `dist/` - Compiled JavaScript assets
- `LICENSE` - MIT license file
- `README.md` - This documentation

Files excluded (via `.gitignore` patterns):

- `src/` - Source files
- `node_modules/` - Dependencies
- Development configuration files

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. Verify your NPM token is correct:

```bash
echo $NPM_TOKEN
```

2. Check if you're logged in:

```bash
npm whoami
```

3. Login manually if needed:

```bash
npm login
```

### Permission Issues

If you get permission errors for the `@pandev-srl` organization:

1. Ensure you're a member of the `@pandev-srl` organization on NPM
2. Verify you have publish permissions
3. Contact the organization owner if needed

### Build Issues

If the build fails:

1. Install dependencies:

```bash
yarn install
```

2. Clear any cache:

```bash
rm -rf dist/
yarn build
```

### Version Conflicts

If you get version conflicts:

1. Check the current published version:

```bash
npm info @pandev-srl/better-ui version
```

2. Ensure your local version is higher than the published version
3. Update `package.json` version accordingly

## Best Practices

1. **Always test locally** before publishing
2. **Follow semantic versioning** strictly
3. **Review changes** in the `dist/` folder after building
4. **Tag releases** in git to track versions
5. **Update changelog** for significant releases
6. **Test installation** after publishing:
   ```bash
   npm install @pandev-srl/better-ui
   ```

## Support

For issues related to:

- **Package publishing**: Check NPM documentation
- **Build process**: Review Vite configuration in `vite.config.js`
- **Library functionality**: See main Better UI documentation
