CI/CD 計画概要
このドキュメントは、neurosis プロジェクトにおける CI/CD (継続的インテグレーション/継続的デリバリー) の全体像と戦略を定義します。

1. 全体的な構成と戦略
CI/CD ツール: GitHub Actions を中心に構築します。

ブランチ戦略: Git-flow に近い戦略を採用し、以下のブランチを使用します。

develop: 開発中の機能統合ブランチ。開発環境へのデプロイをトリガー。

main: 安定版のコードベース。ステージング環境へのデプロイをトリガー。

release/*: リリース準備のためのブランチ。

feature/*: 新機能開発のためのブランチ。

hotfix/*: 緊急修正のためのブランチ。

環境ごとのデプロイ:

develop ブランチへのマージ: 開発環境へ自動デプロイ。

main ブランチへのマージ: ステージング環境へ自動デプロイ。

タグ付け (vX.Y.Z): 本番環境へ手動承認後デプロイ。

シークレット管理:

GitHub Actions Secrets を使用し、API キー、認証情報などの機密情報を安全に管理します。

モバイルアプリのビルド・提出に必要な EAS (Expo Application Services) のシークレットも GitHub Actions Secrets 経由で渡します。

通知:

GitHub Actions のワークフローの成功/失敗に応じて、Slack や Microsoft Teams などに通知を送信するアクションを組み込み、問題の早期発見を促します。

テストの充実:

現在テストスクリプトが未定義のため、CI の最も重要な部分として、ユニットテスト、統合テスト、API テスト、コンポーネントテスト、スナップショットテストの導入と充実を最優先事項とします。

2. バックエンド (back-end/) の CI/CD
目的: コード品質の保証、セキュリティ脆弱性の検出、テストの自動化、デプロイの自動化。

2.1. CI (継続的インテグレーション) ワークフロー
トリガー: develop, main ブランチへのプッシュ、プルリクエストの作成。

ステップ:

Node.js 環境のセットアップ: 指定された Node.js バージョンで環境を構築。

依存関係のインストール: npm ci を実行し、クリーンな依存関係をインストール。

リンティング: ESLint を導入し、コードスタイルと潜在的なエラーをチェック。

静的コード解析: SonarCloud や Snyk などのツールを導入し、コードの品質とセキュリティ脆弱性をスキャン。

セキュリティスキャン: npm audit を実行し、依存関係の既知の脆弱性をチェック。Dependabot alerts も有効化。

テストの実行:

ユニットテスト: Jest を導入し、個々の関数のテストを実行。

API テスト: supertest と Jest を組み合わせて、API エンドポイントの統合テストを実行。

ビルド: (もしビルドステップがあれば)

依存関係のキャッシュ: GitHub Actionsのactions/cacheアクションを使用してnode_modulesをキャッシュし、ビルド時間を短縮。

2.2. CD (継続的デリバリー/デプロイ) ワークフロー
トリガー: CI ワークフローの成功後、develop または main ブランチへのマージ、またはタグ (vX.Y.Z) のプッシュ。

ステップ:

デプロイ:

Docker環境の構築なしで、Gitリポジトリと連携し自動デプロイが可能なPaaS (Platform as a Service) を利用します。

開発/ステージング環境:

デプロイ先候補: Heroku, Render, Railway などを検討。これらのサービスはGit連携により、ブランチへのプッシュをトリガーに自動デプロイが可能です。

環境変数や設定は、GitHub Actions Secrets やデプロイ先のサービスの設定で管理。

自動デプロイ: GitHubリポジトリとPaaSを連携設定することで、developまたはmainブランチへのマージをトリガーに、PaaS側で自動的にアプリケーションをビルド・デプロイします。

（オプション）GitHub Actions内でデプロイコマンドを実行する場合は、各サービスのCLIツールをインストールして実行します。

本番環境:

手動承認: GitHub Actions の環境機能を利用し、デプロイ前に手動承認を必須とする。

ダウンタイムなしデプロイ: デプロイ先のPaaSが提供する機能（例: Renderのブルー/グリーンデプロイメント、HerokuのDyno管理）を活用し、ダウンタイムを最小限に抑えたデプロイを検討。

ロールバック戦略: デプロイ失敗時には、PaaSの機能（例: 以前のデプロイバージョンへの切り戻し）を利用して、迅速に安定した状態に戻す手順を確立。

3. フロントエンド (front-end/mobile-app/) の CI/CD
目的: コード品質の保証、テストの自動化、モバイルアプリのビルドと配布の自動化。

3.1. CI (継続的インテグレーション) ワークフロー
トリガー: develop, main ブランチへのプッシュ、プルリクエストの作成。

ステップ:

Node.js 環境のセットアップ: 指定された Node.js バージョンで環境を構築。

依存関係のインストール: npm ci を実行。

リンティング: ESLint を導入し、コードスタイルをチェック。

TypeScript 型チェック: tsc --noEmit を実行し、型エラーを検出。

テストの実行:

コンポーネントテスト: Jest と React Native Testing Library を導入し、UI コンポーネントのテストを実行。

スナップショットテスト: Jest のスナップショット機能を利用し、UI の予期せぬ変更を検出。

UI/E2E テスト: (将来的に) Detox や Appium などのツールを検討。

Expo ビルドの準備: EAS CLI のインストールと設定。

依存関係のキャッシュ: GitHub Actionsのactions/cacheアクションを使用してnode_modulesをキャッシュし、ビルド時間を短縮。

3.2. CD (継続的デリバリー/デプロイ) ワークフロー
モバイルアプリ (Android/iOS):

推奨: Expo Application Services (EAS) Build & Submit を使用。

トリガー: CI ワークフローの成功後、develop または main ブランチへのマージ、またはタグ (vX.Y.Z) のプッシュ。

ステップ:

EAS Build の実行:

eas build --platform android --profile <profile_name>

eas build --platform ios --profile <profile_name>

<profile_name> は eas.json で定義されたビルドプロファイル (例: development, preview, production)。

iOS コード署名には Fastlane Match などを使用し、証明書とプロビジョニングプロファイルを安全に管理。

GitHub Actions Secrets を使用して、EAS の認証情報や環境変数を渡す。

ベータテストへの配布 (開発/ステージング):

EAS Build で生成されたビルドを Expo Go のプレビュービルドとして配布、または TestFlight (iOS) / Google Play Beta Program (Android) を通じてテスターに配布。

ストアへの提出 (本番):

手動承認: 本番ビルドの提出前に手動承認を必須とする。

eas submit --platform android --latest

eas submit --platform ios --latest

App Store Connect や Google Play Console の認証情報も GitHub Actions Secrets で管理。

リリースノートの自動生成なども検討。

App Store ConnectやGoogle Play Consoleでの自動化設定（例: Fastlane Match for iOSコード署名）も考慮に入れる。

Web アプリ (オプション):

トリガー: CI ワークフローの成功後、develop または main ブランチへのマージ。

ステップ:

Web ビルドの生成: expo export:web を実行し、静的ファイルを生成。

静的ホスティングサービスへのデプロイ:

例: GitHub Pages, Netlify, Vercel など。

各サービスの CLI や GitHub Actions を利用したデプロイアクションを使用。

4. 次のステップ
この計画に基づき、具体的な CI/CD パイプラインの実装を進めていきます。
特に、以下の点について、ご希望に応じて詳細を詰めていくことができます。

テストの導入: バックエンドとフロントエンドのどちらからテストのセットアップを開始するか。

バックエンドの具体的なデプロイ先の決定: Heroku, Render, Railway など、どのPaaSを利用するか。

環境の定義: 開発、ステージング、本番環境の具体的な設定と要件。

モニタリングとロギングの導入: 各PaaSが提供するモニタリング機能や、Sentryなどのエラー監視ツールの導入を検討。