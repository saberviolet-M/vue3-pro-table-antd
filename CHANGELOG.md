# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-alpha.4] - 2025-12-10

### Fixed
- **CI Testing**: Fixed CI test failures and environment issues
- **Ant Design Vue Compatibility**: Fixed `getScrollBarSize` errors in test environments
- **GitHub CI**: Resolved GitHub Actions CI test failures
- **Vitest Configuration**: Fixed Vitest test environment setup and test cases

### Changed
- **Testing Infrastructure**: Improved test reliability and stability
- **CI/CD Pipeline**: Enhanced continuous integration workflow

## [1.0.0-alpha.3] - 2025-12-10

### Fixed
- **ESLint Code Quality**: Fixed all ESLint warnings and formatting issues
- **TypeScript Type Safety**: Reduced `any` type usage with proper type definitions
- **Test Maintenance**: Fixed unused variable warnings and test case assertions
- **Build Process**: Ensured clean builds without ESLint errors in source files

### Changed
- **Code Formatting**: Applied consistent code style with Prettier auto-fix
- **Test Improvements**: Updated test cases to match actual implementation behavior
- **Development Workflow**: Enhanced code quality checks in development process

### Technical Details
- **ESLint Configuration**: Fixed source file linting while excluding build artifacts
- **Type Definitions**: Improved type safety in test utilities and component props
- **Test Environment**: Identified `window.matchMedia` mocking requirement for tests
- **Git Workflow**: Standardized commit messages and version management

## [1.0.0-alpha.2] - 2025-12-09

### Added
- **TypeScript Support**: Complete TypeScript type definitions for all components
- **Enhanced Testing**: Added comprehensive test cases covering edge cases and error handling
- **Documentation Examples**: Created detailed usage examples in `/examples` directory
  - `basic-usage.vue`: Basic ProTable implementation
  - `advanced-usage.vue`: Advanced features with custom slots and rendering
  - `cdn-usage.html`: CDN usage with live demo
- **CI/CD Pipeline**: GitHub Actions workflows for automated testing and publishing
  - `ci.yml`: Automated testing on push and pull requests
  - `publish.yml`: Automated publishing to npm and GitHub Packages
- **CDN Support**: UMD build now available via unpkg and jsDelivr
- **Package Renaming**: Changed from `vue3-pro-table` to `vue3-pro-table-antd` to avoid naming conflicts

### Fixed
- **TypeScript Generation**: Fixed vue-tsc compilation errors and type conflicts
- **Property Naming**: Standardized `hideInSearch` property (was `hideInForm`)
- **Form Validation**: Improved form validation handling in search component
- **Ref Exposure**: Fixed component ref exposure for better TypeScript support
- **Import Conflicts**: Removed duplicate `withDefaults` imports in Vue SFCs
- **Undefined Handling**: Improved handling of optional properties in templates

### Changed
- **Build Configuration**: Updated tsconfig.json for proper type generation
- **Package Structure**: Improved file organization and exports
- **Documentation**: Updated README with new package name and installation instructions
- **Version Bump**: Updated from 1.0.0-alpha.1 to 1.0.0-alpha.2

### Technical Details
- **Type Generation**: Now properly generates `.d.ts` files for all components
- **Test Coverage**: Added tests for request handling, pagination, form validation, and edge cases
- **Build Output**: Both UMD and ES module builds available
- **Dependencies**: Updated dev dependencies including vue-tsc to latest version

## [1.0.0-alpha.1] - 2025-12-09

### Initial Release
- **Core Components**: ProTable, ProTableSearch, ProTableTable, ProTableDefinition
- **Basic Features**:
  - Built-in search form with validation
  - Pagination support
  - Custom column configurations
  - Request function integration
  - Manual request mode
- **TypeScript**: Basic TypeScript support
- **Testing**: Initial test suite with basic component tests
- **Documentation**: README with basic usage examples
- **Build System**: Vite-based build with UMD and ES module outputs

[1.0.0-alpha.4]: https://github.com/saberviolet-M/vue3-pro-table-antd/compare/v1.0.0-alpha.3...v1.0.0-alpha.4
[1.0.0-alpha.3]: https://github.com/saberviolet-M/vue3-pro-table-antd/compare/v1.0.0-alpha.2...v1.0.0-alpha.3
[1.0.0-alpha.2]: https://github.com/saberviolet-M/vue3-pro-table-antd/compare/v1.0.0-alpha.1...v1.0.0-alpha.2
[1.0.0-alpha.1]: https://github.com/saberviolet-M/vue3-pro-table-antd/releases/tag/v1.0.0-alpha.1