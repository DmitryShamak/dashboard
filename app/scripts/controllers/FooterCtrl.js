angular.module("app")
	.controller("FooterCtrl", function($scope) {
		$scope.footer = {};
		$scope.footer.today = moment();

		$scope.footer.socialLinks = [{
			title: "LinkedIn",
			icon: "linkedin",
			href: "https://www.linkedin.com/in/dmitry-shamak-0b3b5486?trk=hp-identity-name"
		}, {
			title: "Odnoklassniki",
			icon: "odnoklassniki",
			href: "https://ok.ru/"
		}, {
			title: "Facebook",
			icon: "facebook",
			href: "https://www.facebook.com"
		}, {
			title: "Instagram",
			icon: "instagram",
			href: "https://www.instagram.com/"
		}];

		$scope.footer.langs = [{
			lang: "ru",
			text: "RU"
		}, {
			lang: "en",
			text: "EN"
		}];
	});