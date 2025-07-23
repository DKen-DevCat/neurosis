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

GitHub Actions のワークフローの成功や失敗に応じて、Slack や Microsoft Teams などに通知を送信するアクションを組み込み、問題の早期発見を促します。

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

Docker環境の構築なしで、Gitリポジトリと連携し自動デプロイが可能なPaaS (Platform as a Service) として **Render** を利用します。

開発/ステージング環境 (Render):

Render と GitHub リポジリを連携設定することで、`develop` または `main` ブランチへのマージをトリガーに、Render 側で自動的にアプリケーションをビルド・デプロイします。

環境変数や設定は、Render のダッシュボードで安全に管理します。必要に応じて、GitHub Actions Secrets から Render の API を介して環境変数を設定することも検討します。

本番環境 (Render):

手動承認: GitHub Actions の環境機能を利用し、デプロイ前に手動承認を必須とする。

ダウンタイムなしデプロイ: Render のブルー/グリーンデプロイメント機能を活用し、ダウンタイムを最小限に抑えたデプロイを実現します。

ロールバック戦略: Render のデプロイ履歴から、以前の安定したデプロイバージョンに迅速に切り戻すことが可能です。

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

### モニタリングとロギングの導入

アプリケーションの健全性を確保し、問題発生時に迅速に対応するためには、適切なモニタリングとロギングが不可欠です。

#### 1. バックエンド (`back-end/`) のモニタリングとロギング

Render にデプロイされるバックエンドについては、以下の点を考慮します。

*   **Render の組み込み機能:**
    *   **ログ:** Render はデプロイされたサービスの標準出力 (stdout) と標準エラー出力 (stderr) を自動的に収集し、ダッシュボードから確認できます。これにより、アプリケーションの基本的な動作状況やエラーメッセージを把握できます。
    *   **メトリクス:** CPU 使用率、メモリ使用量、ネットワークトラフィックなどの基本的なメトリクスも Render ダッシュボードで提供されます。
*   **外部サービスとの連携 (推奨):**
    *   **エラー監視 (Sentry):** アプリケーションで発生したエラーをリアルタイムでキャプチャし、集約、通知、分析するためのツールとして Sentry の導入を強く推奨します。Express.js アプリケーションに Sentry SDK を組み込むことで、エラーの詳細なスタックトレース、コンテキスト情報、ユーザー情報などを収集できます。
    *   **集中ログ管理 (オプション):** より高度なログ分析や検索が必要な場合は、Logtail (Render と統合しやすい), Datadog, New Relic, ELK Stack (Elasticsearch, Logstash, Kibana) などの集中ログ管理サービスへの連携を検討します。これにより、複数のサービスからのログを一元的に管理し、検索や分析を効率化できます。
    *   **パフォーマンス監視 (オプション):** アプリケーションのパフォーマンスボトルネックを特定するために、APM (Application Performance Monitoring) ツール (例: New Relic, Datadog, Prometheus/Grafana) の導入も検討できます。

#### 2. フロントエンド (`front-end/mobile-app/`) のモニタリングとロギング

モバイルアプリケーションについては、以下の点を考慮します。

*   **エラー監視 (Sentry):** バックエンドと同様に、React Native アプリケーションで発生したクラッシュやエラーを監視するために Sentry の導入を強く推奨します。Expo アプリケーションに Sentry SDK を組み込むことで、ユーザー体験に影響を与える問題を迅速に特定し、修正できます。
*   **アナリティクス (オプション):** ユーザーの行動やアプリの利用状況を把握するために、Google Analytics for Firebase や Amplitude などのアナリティクスツールを導入することを検討します。これにより、機能の利用状況、ユーザーフロー、コンバージョンなどを追跡できます。
*   **クラッシュレポート:** EAS Build を使用している場合、Expo は基本的なクラッシュレポート機能を提供しますが、Sentry の方がより詳細な情報と柔軟な設定が可能です。

### 積み残し事項

*   **Google Play Console 認証設定:** Google Play Store へのアプリ提出に必要な認証情報 (`GOOGLE_SERVICE_ACCOUNT_KEY`) の設定が未完了です。Google Play Console でのアプリのセットアップ（アプリの作成、基本情報の入力など）が完了次第、サービスアカウントのリンクと権限付与を行い、GitHub Secrets にキーを追加する必要があります。